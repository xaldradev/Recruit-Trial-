import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";

export async function createResumeDocx(data: any): Promise<Buffer> {
  const {
    name = "Rajesh Kumar",
    email = "rajesh@example.com",
    phone = "+91 90000 00000",
    linkedin = "",
    github = "",
    summary = "Dedicated professional eager to contribute and grow.",
    skills = [],
    experience = [],
    education = [],
    projects = []
  } = data;

  const children: any[] = [];

  // Helper to remove table borders (invisible table)
  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
  };

  // 1. Header (Centered Name)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: name.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: "Arial",
          color: "0f0b24"
        })
      ]
    })
  );

  // Contact Info Line
  const contactParts: string[] = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (linkedin) contactParts.push(`LinkedIn: ${linkedin}`);
  if (github) contactParts.push(`GitHub: ${github}`);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 },
      children: [
        new TextRun({
          text: contactParts.join("   |   "),
          size: 19, // 9.5pt
          font: "Arial",
          color: "4b5563"
        })
      ]
    })
  );

  // Helper for Section Headers
  const addSectionHeader = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        border: {
          bottom: {
            color: "7c3aed",
            space: 6,
            style: BorderStyle.SINGLE,
            size: 12 // 1.5pt
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: "Arial",
            color: "7c3aed"
          })
        ]
      })
    );
  };

  // 2. Professional Summary
  if (summary) {
    addSectionHeader("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({
            text: summary,
            size: 22, // 11pt
            font: "Arial",
            color: "1f2937"
          })
        ]
      })
    );
  }

  // 3. Technical Skills
  if (skills && (Array.isArray(skills) ? skills.length > 0 : String(skills).trim())) {
    addSectionHeader("Technical Skills");
    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills;
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({
            text: skillsText,
            size: 22, // 11pt
            font: "Arial",
            color: "1f2937"
          })
        ]
      })
    );
  }

  // 4. Professional Experience
  if (experience && experience.length > 0) {
    addSectionHeader("Professional Experience");
    
    experience.forEach((job: any) => {
      // Create left-right aligned row using table
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: noBorders,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 75, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      spacing: { before: 120, after: 40 },
                      children: [
                        new TextRun({
                          text: job.role || "Software Engineer",
                          bold: true,
                          size: 22,
                          font: "Arial",
                          color: "0f0b24"
                        }),
                        new TextRun({
                          text: `   at   ${job.company || "Company"}`,
                          size: 22,
                          font: "Arial",
                          color: "4b5563"
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 120, after: 40 },
                      children: [
                        new TextRun({
                          text: job.duration || "",
                          bold: true,
                          size: 20,
                          font: "Arial",
                          color: "4b5563"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      );

      // Bullet points
      if (job.achievements && Array.isArray(job.achievements)) {
        job.achievements.forEach((ach: string) => {
          if (ach && ach.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 30, after: 30 },
                children: [
                  new TextRun({
                    text: ach.trim(),
                    size: 21, // 10.5pt
                    font: "Arial",
                    color: "374151"
                  })
                ]
              })
            );
          }
        });
      }
    });
  }

  // 5. Academic History / Education
  if (education && education.length > 0) {
    addSectionHeader("Education");
    
    education.forEach((edu: any) => {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: noBorders,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 75, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      spacing: { before: 120, after: 40 },
                      children: [
                        new TextRun({
                          text: edu.degree || "Degree",
                          bold: true,
                          size: 22,
                          font: "Arial",
                          color: "0f0b24"
                        }),
                        new TextRun({
                          text: `   from   ${edu.school || "School/University"}`,
                          size: 22,
                          font: "Arial",
                          color: "4b5563"
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 120, after: 40 },
                      children: [
                        new TextRun({
                          text: edu.duration || "",
                          bold: true,
                          size: 20,
                          font: "Arial",
                          color: "4b5563"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      );
    });
  }

  // 6. Notable Projects
  if (projects && projects.length > 0) {
    addSectionHeader("Key Projects");
    
    projects.forEach((proj: any) => {
      const techText = proj.technologies && proj.technologies.length > 0 
        ? `   [${proj.technologies.join(", ")}]` 
        : "";
        
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: proj.title || "Project Title",
              bold: true,
              size: 22,
              font: "Arial",
              color: "0f0b24"
            }),
            new TextRun({
              text: techText,
              italics: true,
              size: 20,
              font: "Arial",
              color: "6b7280"
            })
          ]
        })
      );

      // Description
      if (proj.description) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: proj.description,
                size: 21,
                font: "Arial",
                color: "374151"
              })
            ]
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080,    // 0.75 in
              bottom: 1080, // 0.75 in
              left: 1080,   // 0.75 in
              right: 1080,  // 0.75 in
            }
          }
        },
        children: children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
