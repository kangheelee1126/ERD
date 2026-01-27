export interface Menu {
    menuId: string;
    upMenuId: string | null;
    menuName: string;
    menuUrl: string | null;
    menuIcon: string | null; // ✨ 추가
    sortNo: number;
    useYn: 'Y' | 'N';
    children: Menu[];
  }