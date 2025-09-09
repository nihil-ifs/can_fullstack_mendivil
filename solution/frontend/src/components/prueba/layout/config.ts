import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'correo', title: 'Correo', href: paths.prueba.correo, icon: 'envelope', external: true },
  { key: 'documentos', title: 'Documentos', href: paths.prueba.documentos, icon: 'file' },
] satisfies NavItemConfig[];
