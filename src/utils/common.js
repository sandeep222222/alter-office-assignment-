export const isImageOrVideo = (url) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const videoExtensions = ["mp4", "webm", "ogg", "mkv", "mov", "avi", "flv"];
  
    if (imageExtensions.some((ext) => url.includes(ext))) {
      return "image";
    }
  
    if (videoExtensions.some((ext) => url.includes(ext))) {
      return "video";
    }
  };
  
  export const getTimeAgo = (firestoreTimestamp) => {
    const postDate = firestoreTimestamp.toDate();
    const now = new Date();
    const secondsElapsed = Math.floor((now - postDate) / 1000);
  
    if (secondsElapsed < 60) {
      return `${secondsElapsed} second${secondsElapsed > 1 ? "s" : ""}`;
    } else if (secondsElapsed < 3600) {
      const minutes = Math.floor(secondsElapsed / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (secondsElapsed < 86400) {
      const hours = Math.floor(secondsElapsed / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(secondsElapsed / 86400);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };