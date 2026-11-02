// Tab order drives the page-transition direction: moving to a tab further down this list slides left.
export const tabs = [
  { href: 'color/', label: 'Color', icon: 'palette' },
  { href: 'typography/', label: 'Typography', icon: 'pen-nib' },
  { href: 'spacing/', label: 'Spacing', icon: 'table' },
  { href: 'brand/', label: 'Brand', icon: 'person-simple' },
  { href: 'shadows-borders/', label: 'Shadows & borders', icon: 'intersect' },
  { href: 'layouts/', label: 'Layouts', icon: 'layout' },
  { href: 'iconography/', label: 'Iconography', icon: 'image-square' },
  { href: 'how-to-use/', label: 'How to use', icon: 'rocket-launch' },
] as const;
