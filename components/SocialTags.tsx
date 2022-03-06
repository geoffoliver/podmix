type SocialTagsProps = {
  title: string;
  type?: string;
  image?: string;
  description?: string;
  url?: string;
};

const SocialTags = ({ title, image, type, description, url }: SocialTagsProps) => {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type || 'music.playlist'} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:site" content="@podmixme" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};

export default SocialTags;
