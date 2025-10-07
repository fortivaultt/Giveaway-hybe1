export const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2,0.8,0.2,1] } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.25 } }
};

export const modalVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, type: 'spring', stiffness: 220 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
};
