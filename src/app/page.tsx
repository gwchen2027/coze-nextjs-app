'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText,
  ArrowLeft,
  Printer,
  Eye,
  Edit3,
  Download,
  Image,
  FileDown,
  FileType,
  Loader2,
  ChevronDown,
  Save,
  FolderOpen,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { defaultResumeData } from '@/types/resume';
import type { ResumeData } from '@/types/resume';
import { exportAsImage, exportAsPDF, exportAsDOCX } from '@/lib/export-utils';
import { toast } from 'sonner';

const STORAGE_KEY = 'resume-builder-data';
const ARCHIVE_KEY = 'resume-builder-archives';

/** 从 localStorage 加载数据 */
function loadFromStorage(): ResumeData {
  if (typeof window === 'undefined') return defaultResumeData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ResumeData;
    }
  } catch {
    // 解析失败时使用默认值
  }
  return defaultResumeData;
}

/** 保存数据到 localStorage */
function saveToStorage(data: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 存储失败（可能超出容量）
  }
}

/** 保存存档（带时间戳） */
function saveArchive(data: ResumeData): string {
  if (typeof window === 'undefined') return '';
  const name = data.basicInfo.name || '未命名简历';
  const timestamp = new Date().toLocaleString('zh-CN');
  const archiveName = `${name} - ${timestamp}`;

  try {
    const existing = localStorage.getItem(ARCHIVE_KEY);
    const archives: Record<string, ResumeData> = existing ? JSON.parse(existing) : {};
    archives[archiveName] = data;
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archives));
  } catch {
    // 存储失败
  }
  return archiveName;
}

/** 获取所有存档名称 */
function getArchiveNames(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = localStorage.getItem(ARCHIVE_KEY);
    if (existing) {
      return Object.keys(JSON.parse(existing));
    }
  } catch {
    // 解析失败
  }
  return [];
}

/** 加载指定存档 */
function loadArchive(name: string): ResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing = localStorage.getItem(ARCHIVE_KEY);
    if (existing) {
      const archives: Record<string, ResumeData> = JSON.parse(existing);
      return archives[name] || null;
    }
  } catch {
    // 解析失败
  }
  return null;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [exporting, setExporting] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showArchiveMenu, setShowArchiveMenu] = useState(false);
  const [archiveNames, setArchiveNames] = useState<string[]>([]);
  const resumeRef = useRef<HTMLDivElement>(null);

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const data = loadFromStorage();
    setResumeData(data);
    setArchiveNames(getArchiveNames());
  }, []);

  // 数据变化时自动保存
  useEffect(() => {
    const hasContent =
      resumeData.basicInfo.name ||
      resumeData.summary ||
      resumeData.education.length > 0 ||
      resumeData.experience.length > 0;
    if (hasContent) {
      saveToStorage(resumeData);
    }
  }, [resumeData]);

  const handleDataChange = useCallback((data: ResumeData) => {
    setResumeData(data);
    setSaved(false);
  }, []);

  const handleGenerate = () => {
    setView('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  // 手动存档
  const handleSaveArchive = () => {
    const name = saveArchive(resumeData);
    if (name) {
      setSaved(true);
      setArchiveNames(getArchiveNames());
      setTimeout(() => setSaved(false), 2000);
    }
  };

  // 打开存档菜单
  const handleOpenArchiveMenu = () => {
    setArchiveNames(getArchiveNames());
    setShowArchiveMenu(true);
  };

  // 加载存档
  const handleLoadArchive = (archiveName: string) => {
    const data = loadArchive(archiveName);
    if (data) {
      setResumeData(data);
      saveToStorage(data);
      setShowArchiveMenu(false);
    }
  };

  const getResumeElement = useCallback((): HTMLElement | null => {
    if (!resumeRef.current) return null;
    return resumeRef.current.querySelector('.resume-page') as HTMLElement | null;
  }, []);

  const handleExportImage = async () => {
    const el = getResumeElement();
    if (!el) {
      toast.error('请先预览简历后再导出');
      return;
    }
    setExporting('image');
    try {
      await exportAsImage(el, resumeData.basicInfo.name || '简历');
      toast.success('图片已保存');
    } catch (err) {
      console.error('导出图片失败:', err);
      toast.error('导出图片失败，请重试');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    const el = getResumeElement();
    if (!el) {
      toast.error('请先预览简历后再导出');
      return;
    }
    setExporting('pdf');
    try {
      await exportAsPDF(el, resumeData.basicInfo.name || '简历');
      toast.success('PDF 已保存');
    } catch (err) {
      console.error('导出PDF失败:', err);
      toast.error('导出PDF失败，请重试');
    } finally {
      setExporting(null);
    }
  };

  const handleExportDOCX = async () => {
    setExporting('docx');
    try {
      await exportAsDOCX(resumeData, resumeData.basicInfo.name || '简历');
      toast.success('Word 文档已保存');
    } catch (err) {
      console.error('导出DOCX失败:', err);
      toast.error('导出Word失败，请重试');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1a2332] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1a2332] leading-tight">简历生成器</h1>
              <p className="text-xs text-gray-400 leading-tight">上传照片 · 填写信息 · 一键生成</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 存档按钮 - 始终可见 */}
            <Button
              variant="outline"
              onClick={handleSaveArchive}
              className="cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-600">已存档</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  存档
                </>
              )}
            </Button>

            {/* 读取存档 */}
            <DropdownMenu open={showArchiveMenu} onOpenChange={setShowArchiveMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleOpenArchiveMenu}
                  className="cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 mr-1" />
                  读取
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-64 overflow-y-auto">
                {archiveNames.length === 0 ? (
                  <DropdownMenuItem disabled>暂无存档</DropdownMenuItem>
                ) : (
                  archiveNames.map((name) => (
                    <DropdownMenuItem
                      key={name}
                      onClick={() => handleLoadArchive(name)}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{name}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {view === 'preview' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setView('form')}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  编辑
                </Button>

                {/* 下载按钮组 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="bg-[#c9a96e] hover:bg-[#b8984d] text-white cursor-pointer"
                      disabled={!!exporting}
                    >
                      {exporting ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      {exporting ? '导出中...' : '下载'}
                      <ChevronDown className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleExportImage}
                      disabled={!!exporting}
                      className="cursor-pointer"
                    >
                      <Image className="w-4 h-4 mr-2 text-blue-500" />
                      保存为图片 (PNG)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportPDF}
                      disabled={!!exporting}
                      className="cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 mr-2 text-red-500" />
                      保存为 PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportDOCX}
                      disabled={!!exporting}
                      className="cursor-pointer"
                    >
                      <FileType className="w-4 h-4 mr-2 text-blue-600" />
                      保存为 Word (DOCX)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-1" />
                  打印
                </Button>
              </>
            )}
            {view === 'form' && (
              <Button
                variant="outline"
                onClick={() => setView('preview')}
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-1" />
                预览
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="print:p-0">
        {view === 'form' ? (
          <div className="max-w-2xl mx-auto px-4 py-8 print:hidden">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#1a2332] mb-2">创建你的专业简历</h2>
              <p className="text-gray-500 text-sm">
                上传一张照片，填写你的个人信息，即可生成精美简历
              </p>
            </div>
            <ResumeForm
              data={resumeData}
              onChange={handleDataChange}
              onSubmit={handleGenerate}
            />
          </div>
        ) : (
          <div ref={resumeRef} className="resume-preview-container">
            {/* 预览模式下的操作提示 */}
            <div className="text-center py-4 print:hidden bg-white border-b border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Edit3 className="w-4 h-4" />
                <span>预览模式 — 点击「下载」可导出为图片、PDF 或 Word 文档</span>
              </div>
            </div>
            <div className="py-8 px-4 print:p-0 print:py-0">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
