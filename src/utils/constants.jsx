import {
    FaTwitter,
    FaFacebook,
    FaDiscord,
    FaFacebookMessenger,
    FaTelegramPlane,
    FaInstagramSquare,
  } from "react-icons/fa";
  import { GrReddit } from "react-icons/gr";
  import { RiWhatsappFill } from "react-icons/ri";
  
  export const sharePost = [
    {
      name: "Twitter",
      bgColor: "#E9F6FB",
      iconColor: "#03A9F4",
      icon: <FaTwitter />,
      linkOfPlatform: "https://twitter.com/intent/tweet?url=POST_LINK",
    },
    {
      name: "Facebook",
      bgColor: "#E7F1FD",
      iconColor: "#1877F2",
      icon: <FaFacebook />,
      linkOfPlatform: "https://www.facebook.com/sharer/sharer.php?u=POST_LINK",
    },
    {
      name: "Reddit",
      bgColor: "#FDECE7",
      iconColor: "#FF5722",
      icon: <GrReddit />,
      linkOfPlatform: "https://www.reddit.com/submit?url=POST_LINK",
    },
    {
      name: "Discord",
      bgColor: "#ECF5FA",
      iconColor: "#6665D2",
      icon: <FaDiscord />,
      linkOfPlatform: "https://discord.com/channels/@me",
    },
    {
      name: "WhatsApp",
      bgColor: "#E7FBF0",
      iconColor: "#67C15E",
      icon: <RiWhatsappFill />,
      linkOfPlatform: "https://wa.me/?text=Check this out: POST_LINK",
    },
    {
      name: "Messenger",
      bgColor: "#E5F3FE",
      iconColor: "#1E88E5",
      icon: <FaFacebookMessenger />,
      linkOfPlatform: "https://www.facebook.com/dialog/send?link=POST_LINK",
    },
    {
      name: "Telegram",
      bgColor: "#E6F3FB",
      iconColor: "#1B92D1",
      icon: <FaTelegramPlane />,
      linkOfPlatform: "https://t.me/share/url?url=POST_LINK",
    },
    {
      name: "Instagram",
      bgColor: "#FF40C617",
      iconColor:
        "linear-gradient(49.1deg, #FFDD55 6.59%, #FF543E 50.03%, #C837AB 93.47%)",
      icon: <FaInstagramSquare />,
      linkOfPlatform: "",
    },
  ];
  