export type MenuElement = {
  id: number;
  name: string;
  url: string;
  component?: string;
  menuPosition?: string;
  children?: MenuElement[];
};

export type Menu = MenuElement[];
