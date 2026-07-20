import { toPng, toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from '@/types/resume';

const exportOptions = {
  pixelRatio: 2,
  backgroundColor: '#ffffff',
  cacheBust: true,
  fontEmbedCSS: '',
  filter: (node: Node) => {
    // 过滤掉不需要的节点
    if (node instanceof HTMLElement) {
      if (node.classList?.contains('print:hidden')) return false;
    }
    return true;
  },
};

/**
 * 导出为图片 (PNG)
 */
export async function exportAsImage(element: HTMLElement, filename = '简历'): Promise<void> {
  const blob = await toBlob(element, exportOptions);
  if (!blob) {
    throw new Error('生成图片失败：无法创建图片数据');
  }
  saveAs(blob, `${filename}.png`);
}

/**
 * 导出为 PDF
 */
export async function exportAsPDF(element: HTMLElement, filename = '简历'): Promise<void> {
  const dataUrl = await toPng(element, exportOptions);

  // 加载图片获取尺寸
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片数据加载失败'));
    image.src = dataUrl;
  });

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = 297; // A4 height in mm
  const imgWidth = pdfWidth;
  const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;

  const pdf = new jsPDF('p', 'mm', 'a4');

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * 导出为 DOCX
 */
export async function exportAsDOCX(data: ResumeData, filename = '简历'): Promise<void> {
  const { basicInfo, summary, education, experience, skills, languages, certifications, photo } = data;

  const children: Paragraph[] = [];

  // 照片
  if (photo) {
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: arrayBuffer,
              transformation: { width: 100, height: 100 },
              type: 'png',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    } catch {
      // 照片转换失败时跳过
    }
  }

  // 姓名
  if (basicInfo.name) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: basicInfo.name,
            bold: true,
            size: 36,
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 100 },
      })
    );
  }

  // 职位
  if (basicInfo.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: basicInfo.title,
            size: 24,
            color: '8a7040',
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // 联系信息
  const contactItems: string[] = [];
  if (basicInfo.email) contactItems.push(basicInfo.email);
  if (basicInfo.phone) contactItems.push(basicInfo.phone);
  if (basicInfo.location) contactItems.push(basicInfo.location);
  if (basicInfo.website) contactItems.push(basicInfo.website);

  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactItems.join('  |  '),
            size: 20,
            color: '636e72',
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 400 },
      })
    );
  }

  // 分割线
  children.push(createDivider());

  // 个人简介
  if (summary) {
    children.push(createSectionTitle('个人简介'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: summary,
            size: 21,
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // 工作经验
  if (experience.length > 0) {
    children.push(createDivider());
    children.push(createSectionTitle('工作经验'));
    for (const exp of experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
              font: 'Microsoft YaHei',
            }),
            new TextRun({ text: '  ' }),
            new TextRun({
              text: `${exp.startDate} - ${exp.endDate}`,
              size: 20,
              color: '636e72',
              font: 'Microsoft YaHei',
            }),
          ],
          spacing: { before: 200, after: 60 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company,
              size: 21,
              color: '8a7040',
              font: 'Microsoft YaHei',
            }),
          ],
          spacing: { after: 80 },
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 21,
                font: 'Microsoft YaHei',
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }
  }

  // 教育经历
  if (education.length > 0) {
    children.push(createDivider());
    children.push(createSectionTitle('教育经历'));
    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.school,
              bold: true,
              size: 22,
              font: 'Microsoft YaHei',
            }),
            new TextRun({ text: '  ' }),
            new TextRun({
              text: `${edu.startDate} - ${edu.endDate}`,
              size: 20,
              color: '636e72',
              font: 'Microsoft YaHei',
            }),
          ],
          spacing: { before: 200, after: 60 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [edu.degree, edu.major].filter(Boolean).join(' · '),
              size: 21,
              color: '8a7040',
              font: 'Microsoft YaHei',
            }),
          ],
          spacing: { after: 80 },
        })
      );
      if (edu.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.description,
                size: 21,
                font: 'Microsoft YaHei',
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }
  }

  // 专业技能
  if (skills.length > 0) {
    children.push(createDivider());
    children.push(createSectionTitle('专业技能'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skills.join('、'),
            size: 21,
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // 语言能力
  if (languages.length > 0) {
    children.push(createDivider());
    children.push(createSectionTitle('语言能力'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: languages.join('、'),
            size: 21,
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // 证书
  if (certifications.length > 0) {
    children.push(createDivider());
    children.push(createSectionTitle('证书/资质'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: certifications.join('、'),
            size: 21,
            font: 'Microsoft YaHei',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

function createSectionTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26,
        color: '1a2332',
        font: 'Microsoft YaHei',
      }),
    ],
    spacing: { before: 100, after: 200 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: 'c9a96e',
        space: 4,
      },
    },
  });
}

function createDivider(): Paragraph {
  return new Paragraph({
    children: [],
    spacing: { before: 100, after: 100 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: 'e0e0e0',
        space: 1,
      },
    },
  });
}
