export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  author: {
    name: string;
    profile?: string;
    email: string;
    github: string;
    linkedin?: string;
  };
  comments: {
    giscusScript: string;
  };
}
