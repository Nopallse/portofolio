import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { COLORS } from "@/utils/designTokens";
 
import { useRef, useState } from "react";
 
export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};
 
const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "block md:hidden flex flex-row items-end justify-center h-16 mx-auto w-fit gap-4 rounded-2xl px-4 pb-3",
        className,
      )}
      style={{
        background: COLORS.secondary,
        border: `1px solid ${COLORS.gray[700]}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {items.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent.primary} 0%, ${COLORS.accent.secondary} 100%)`,
            boxShadow: '0 4px 16px rgba(255, 144, 0, 0.3)',
          }}
        >
          <div className="h-4 w-4" style={{ color: COLORS.black }}>{item.icon}</div>
        </a>
      ))}
    </motion.div>
  );
};
 
const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden h-16 mx-auto w-fit justify-center items-end gap-4 rounded-2xl px-4 pb-3 md:flex",
        className,
      )}
      style={{
        background: COLORS.secondary,
        border: `1px solid ${COLORS.gray[700]}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};
 
function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);
 
  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
 
    return val - bounds.x - bounds.width / 2;
  });
 
  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
 
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );
 
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
 
  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
 
  const [hovered, setHovered] = useState(false);
 
  return (
    <a href={href}>
      <motion.div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full"
        style={{
          width,
          height,
          background: `linear-gradient(135deg, ${COLORS.accent.primary} 0%, ${COLORS.accent.secondary} 100%)`,
          boxShadow: '0 4px 16px rgba(255, 144, 0, 0.3)',
        }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md px-2 py-0.5 text-xs whitespace-pre"
              style={{
                background: COLORS.secondary,
                border: `1px solid ${COLORS.gray[700]}`,
                color: COLORS.text,
              }}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          <div style={{ color: COLORS.black }}>
            {icon}
          </div>
        </motion.div>
      </motion.div>
    </a>
  );
}