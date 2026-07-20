'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  FileText,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PhotoUpload } from './photo-upload';
import type {
  ResumeData,
  EducationItem,
  ExperienceItem,
} from '@/types/resume';
import { createEducationItem, createExperienceItem } from '@/types/resume';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onSubmit: () => void;
}

interface SectionHeaderProps {
  icon: typeof User;
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
}

function SectionHeader({ icon: Icon, title, expanded, onToggle, sectionKey }: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(sectionKey)}
      className="flex items-center justify-between w-full py-3 cursor-pointer group"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#c9a96e]" />
        <h3 className="text-base font-semibold text-[#1a2332]">{title}</h3>
      </div>
      {expanded ? (
        <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#c9a96e] transition-colors" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#c9a96e] transition-colors" />
      )}
    </button>
  );
}

export function ResumeForm({ data, onChange, onSubmit }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    summary: true,
    education: true,
    experience: true,
    skills: true,
    languages: true,
    certifications: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateBasicInfo = (field: string, value: string) => {
    onChange({
      ...data,
      basicInfo: { ...data.basicInfo, [field]: value },
    });
  };

  const addEducation = () => {
    onChange({ ...data, education: [...data.education, createEducationItem()] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    onChange({
      ...data,
      education: data.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((item) => item.id !== id),
    });
  };

  const addExperience = () => {
    onChange({ ...data, experience: [...data.experience, createExperienceItem()] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((item) => item.id !== id),
    });
  };

  const updateSkills = (value: string) => {
    onChange({
      ...data,
      skills: value.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean),
    });
  };

  const updateLanguages = (value: string) => {
    onChange({
      ...data,
      languages: value.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean),
    });
  };

  const updateCertifications = (value: string) => {
    onChange({
      ...data,
      certifications: value.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      {/* 照片上传 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <PhotoUpload
            value={data.photo}
            onChange={(val) => onChange({ ...data, photo: val })}
          />
          <p className="text-center text-xs text-gray-400 mt-3">
            点击或拖拽上传个人照片
          </p>
        </CardContent>
      </Card>

      {/* 基本信息 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={User} title="基本信息" sectionKey="basic" expanded={expandedSections.basic} onToggle={toggleSection} />
          {expandedSections.basic && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">姓名</Label>
                  <Input
                    value={data.basicInfo.name}
                    onChange={(e) => updateBasicInfo('name', e.target.value)}
                    placeholder="请输入姓名"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">职位头衔</Label>
                  <Input
                    value={data.basicInfo.title}
                    onChange={(e) => updateBasicInfo('title', e.target.value)}
                    placeholder="如：前端工程师"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">
                    <Mail className="w-3.5 h-3.5 inline mr-1" />
                    邮箱
                  </Label>
                  <Input
                    value={data.basicInfo.email}
                    onChange={(e) => updateBasicInfo('email', e.target.value)}
                    placeholder="example@email.com"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    电话
                  </Label>
                  <Input
                    value={data.basicInfo.phone}
                    onChange={(e) => updateBasicInfo('phone', e.target.value)}
                    placeholder="请输入联系电话"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    所在城市
                  </Label>
                  <Input
                    value={data.basicInfo.location}
                    onChange={(e) => updateBasicInfo('location', e.target.value)}
                    placeholder="如：北京市"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">
                    <Globe className="w-3.5 h-3.5 inline mr-1" />
                    个人网站
                  </Label>
                  <Input
                    value={data.basicInfo.website}
                    onChange={(e) => updateBasicInfo('website', e.target.value)}
                    placeholder="https://..."
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 个人简介 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={FileText} title="个人简介" sectionKey="summary" expanded={expandedSections.summary} onToggle={toggleSection} />
          {expandedSections.summary && (
            <div className="mt-2">
              <Textarea
                value={data.summary}
                onChange={(e) => onChange({ ...data, summary: e.target.value })}
                placeholder="简要描述你的职业背景、核心优势和求职目标..."
                rows={4}
                className="resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 教育经历 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={GraduationCap} title="教育经历" sectionKey="education" expanded={expandedSections.education} onToggle={toggleSection} />
          {expandedSections.education && (
            <div className="space-y-4 mt-2">
              {data.education.map((edu, index) => (
                <div key={edu.id} className="relative p-4 bg-gray-50/80 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#c9a96e]">教育经历 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="学校名称"
                      className="h-9"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="学历（如：本科/硕士）"
                      className="h-9"
                    />
                  </div>
                  <Input
                    value={edu.major}
                    onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                    placeholder="专业"
                    className="h-9"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      placeholder="开始时间（如：2018.09）"
                      className="h-9"
                    />
                    <Input
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="结束时间（如：2022.06）"
                      className="h-9"
                    />
                  </div>
                  <Textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="在校经历、荣誉等（选填）"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="w-full border-dashed text-[#c9a96e] border-[#c9a96e]/40 hover:bg-[#c9a96e]/5 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加教育经历
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 工作经验 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={Briefcase} title="工作经验" sectionKey="experience" expanded={expandedSections.experience} onToggle={toggleSection} />
          {expandedSections.experience && (
            <div className="space-y-4 mt-2">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="relative p-4 bg-gray-50/80 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#c9a96e]">工作经历 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="公司名称"
                      className="h-9"
                    />
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="职位"
                      className="h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="开始时间（如：2022.07）"
                      className="h-9"
                    />
                    <Input
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="结束时间（如：至今）"
                      className="h-9"
                    />
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="工作内容和主要成果..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full border-dashed text-[#c9a96e] border-[#c9a96e]/40 hover:bg-[#c9a96e]/5 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加工作经验
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 技能 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={Wrench} title="专业技能" sectionKey="skills" expanded={expandedSections.skills} onToggle={toggleSection} />
          {expandedSections.skills && (
            <div className="mt-2">
              <Textarea
                value={data.skills.join(', ')}
                onChange={(e) => updateSkills(e.target.value)}
                placeholder="用逗号分隔，如：JavaScript, React, TypeScript, Node.js"
                rows={3}
                className="resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 语言能力 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={Languages} title="语言能力" sectionKey="languages" expanded={expandedSections.languages} onToggle={toggleSection} />
          {expandedSections.languages && (
            <div className="mt-2">
              <Textarea
                value={data.languages.join(', ')}
                onChange={(e) => updateLanguages(e.target.value)}
                placeholder="如：英语（流利）、日语（N2）"
                rows={2}
                className="resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 证书 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 px-6 pb-6">
          <SectionHeader icon={Award} title="证书/资质" sectionKey="certifications" expanded={expandedSections.certifications} onToggle={toggleSection} />
          {expandedSections.certifications && (
            <div className="mt-2">
              <Textarea
                value={data.certifications.join(', ')}
                onChange={(e) => updateCertifications(e.target.value)}
                placeholder="如：PMP、AWS 认证、CPA"
                rows={2}
                className="resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* 生成按钮 */}
      <Button
        onClick={onSubmit}
        className="w-full h-12 text-base font-medium bg-[#1a2332] hover:bg-[#2d3e54] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <FileText className="w-5 h-5 mr-2" />
        生成简历
      </Button>
    </div>
  );
}
