export function blockNoteToText(content: string): string {
  try {
    const blocks = JSON.parse(content);
    if (!Array.isArray(blocks)) return content;
    
    return blocks
      .map((block: any) => {
        if (block.content) {
          return block.content
            .map((item: any) => item.text || "")
            .join("");
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
  } catch {
    return content;
  }
}

export function blockNoteToHTML(content: string): string {
  try {
    const blocks = JSON.parse(content);
    if (!Array.isArray(blocks)) return `<p>${content}</p>`;
    
    return blocks
      .map((block: any) => {
        const text = block.content
          ?.map((item: any) => {
            let t = item.text || "";
            if (item.styles?.bold) t = `<strong>${t}</strong>`;
            if (item.styles?.italic) t = `<em>${t}</em>`;
            if (item.styles?.underline) t = `<u>${t}</u>`;
            return t;
          })
          .join("") || "";
        
        switch (block.type) {
          case "heading":
            const level = block.props?.level || 1;
            return `<h${level}>${text}</h${level}>`;
          case "bulletListItem":
            return `<li>${text}</li>`;
          case "numberedListItem":
            return `<li>${text}</li>`;
          default:
            return `<p>${text}</p>`;
        }
      })
      .join("");
  } catch {
    return `<p>${content}</p>`;
  }
}
