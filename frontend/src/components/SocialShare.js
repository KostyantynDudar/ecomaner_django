import React from "react";

const SocialShare = ({ title, url }) => {
    const shareText = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);

    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1877F2", textDecoration: "none" }}
            >
                Facebook
            </a>
            <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1DA1F2", textDecoration: "none" }}
            >
                Twitter
            </a>
            <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0088CC", textDecoration: "none" }}
            >
                Telegram
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0077B5", textDecoration: "none" }}
            >
                LinkedIn
            </a>
        </div>
    );
};

export default SocialShare;
