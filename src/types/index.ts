export interface Project {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  status: '진행중' | '완료' | '중단';
  period: {
    start: string;
    end: string;
  };
  technologies: string[];
  links: {
    github?: string;
    demo?: string;
    website?: string;
  };
}

export interface ProjectsData {
  projects: Project[];
}

export interface Experience {
  company: string;
  position: string;
  period: {
    start: string;
    end: string;
  };
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: {
    start: string;
    end: string;
  };
}

export interface Skills {
  frontend: string[];
  backend: string[];
  devopsAndTools: string[];
}

export interface Profile {
  name: string;
  title: string;
  description: string[];
}

export interface ResumeData {
  profile: Profile;
  skills: Skills;
  experience: Experience[];
  education: Education[];
}