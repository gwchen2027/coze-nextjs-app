'use client';

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
} from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { photo, basicInfo, summary, education, experience, skills, languages, certifications } = data;

  const hasContent = basicInfo.name || summary || education.length > 0 || experience.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">填写信息后预览简历</p>
          <p className="text-sm mt-1">左侧填写完成后点击「生成简历」</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page bg-white w-full max-w-[210mm] mx-auto shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* 头部区域 */}
      <div className="bg-[#1a2332] text-white px-10 py-8">
        <div className="flex items-center gap-8">
          {photo && (
            <img
              src={photo}
              alt="个人照片"
              className="w-28 h-28 rounded-full object-cover border-3 border-[#c9a96e] shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-wide mb-1">
              {basicInfo.name || '您的姓名'}
            </h1>
            {basicInfo.title && (
              <p className="text-[#c9a96e] text-lg font-medium mb-3">{basicInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-300">
              {basicInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c9a96e]" />
                  {basicInfo.email}
                </span>
              )}
              {basicInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c9a96e]" />
                  {basicInfo.phone}
                </span>
              )}
              {basicInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c9a96e]" />
                  {basicInfo.location}
                </span>
              )}
              {basicInfo.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#c9a96e]" />
                  {basicInfo.website}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-10 py-8 space-y-7">
        {/* 个人简介 */}
        {summary && (
          <Section title="个人简介" icon={null}>
            <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
          </Section>
        )}

        {/* 工作经验 */}
        {experience.length > 0 && (
          <Section title="工作经验" icon={<Briefcase className="w-4 h-4" />}>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-[#c9a96e]/30">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#c9a96e]" />
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-[#1a2332] text-sm">{exp.position}</h4>
                      <p className="text-[#c9a96e] text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mt-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 教育经历 */}
        {education.length > 0 && (
          <Section title="教育经历" icon={<GraduationCap className="w-4 h-4" />}>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-[#c9a96e]/30">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#c9a96e]" />
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-[#1a2332] text-sm">{edu.school}</h4>
                      <p className="text-gray-500 text-sm">
                        {edu.degree}{edu.degree && edu.major ? ' · ' : ''}{edu.major}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 专业技能 */}
        {skills.length > 0 && (
          <Section title="专业技能" icon={<Wrench className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#1a2332]/5 text-[#1a2332] text-sm rounded-md border border-[#1a2332]/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* 语言能力 */}
        {languages.length > 0 && (
          <Section title="语言能力" icon={<Languages className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#c9a96e]/10 text-[#8a7040] text-sm rounded-md border border-[#c9a96e]/20"
                >
                  {lang}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* 证书 */}
        {certifications.length > 0 && (
          <Section title="证书/资质" icon={<Award className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-green-50 text-green-800 text-sm rounded-md border border-green-200"
                >
                  {cert}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-base font-bold text-[#1a2332] tracking-wide">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-[#c9a96e]/40 to-transparent" />
      </div>
      {children}
    </div>
  );
}
