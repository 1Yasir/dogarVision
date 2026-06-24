import { Helmet } from "react-helmet-async";

const SITE_NAME = "Dogar Vision";
const DEFAULT_OG_IMAGE = "https://dogarvision.com/og-image.jpg";

/**
 * Central SEO wrapper — injects title, meta description, keywords, and OpenGraph tags
 * for WhatsApp/Facebook link previews on every main page view.
 */
export default function SeoHelmet({
  title,
  description,
  keywords,
  image = DEFAULT_OG_IMAGE,
  url,
  type = "website",
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
