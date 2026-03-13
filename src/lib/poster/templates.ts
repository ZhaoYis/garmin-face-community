// 海报模板配置
export interface PosterTemplateConfig {
  id: number;
  name: string;
  key: string;
  category: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  config: {
    width: number;
    height: number;
    dataFields: string[];
    customFields?: string[];
  };
  isFree: boolean;
  price?: string;
  sortOrder: number;
}

// 预设模板数据
export const POSTER_TEMPLATES: PosterTemplateConfig[] = [
  {
    id: 1,
    name: "成就海报",
    key: "achievement",
    category: "race",
    config: {
      width: 750,
      height: 1334,
      dataFields: [
        "raceName",
        "finishTime",
        "avgPace",
        "distance",
        "avgHr",
        "elevationGain",
        "date",
      ],
      customFields: ["customText"],
    },
    isFree: true,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "极简海报",
    key: "minimal",
    category: "daily",
    config: {
      width: 750,
      height: 1334,
      dataFields: ["distance", "finishTime", "avgPace", "date"],
      customFields: ["customText"],
    },
    isFree: true,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "艺术海报",
    key: "art",
    category: "social",
    config: {
      width: 750,
      height: 1334,
      dataFields: [
        "raceName",
        "finishTime",
        "distance",
        "avgPace",
        "date",
      ],
      customFields: ["customText"],
    },
    isFree: true,
    sortOrder: 3,
  },
  {
    id: 4,
    name: "越野海报",
    key: "trail",
    category: "trail",
    config: {
      width: 750,
      height: 1334,
      dataFields: [
        "raceName",
        "finishTime",
        "distance",
        "avgPace",
        "elevationGain",
        "date",
      ],
      customFields: ["customText"],
    },
    isFree: true,
    sortOrder: 4,
  },
];

// 模板样式配置
export const TEMPLATE_STYLES: Record<string, {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}> = {
  achievement: {
    primaryColor: "#FFD700",
    secondaryColor: "#FF6B00",
    backgroundColor: "#0F172A",
    textColor: "#FFFFFF",
    fontFamily: "system-ui",
  },
  minimal: {
    primaryColor: "#0F172A",
    secondaryColor: "#64748B",
    backgroundColor: "#FFFFFF",
    textColor: "#0F172A",
    fontFamily: "system-ui",
  },
  art: {
    primaryColor: "#FF6B00",
    secondaryColor: "#FFD700",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#FFFFFF",
    fontFamily: "system-ui",
  },
  trail: {
    primaryColor: "#8B4513",
    secondaryColor: "#D2691E",
    backgroundColor: "#1A1A2E",
    textColor: "#F5DEB3",
    fontFamily: "system-ui",
  },
};
