export function formatTimeAgo(dateStr: string): string {
    if (!dateStr) return "Just now";
  
    const now = new Date();
    const date = new Date(dateStr);
  
    if (isNaN(date.getTime())) return "Invalid date";
  
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
  
    if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    }
  
    const diffHrs = Math.floor(diffMs / (60 * 60 * 1000));
    if (diffHrs < 24) {
      return `${diffHrs} hr${diffHrs === 1 ? "" : "s"} ago`;
    }
  
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
  
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
    }
  
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }