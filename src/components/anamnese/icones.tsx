import type { SVGProps } from "react";
import type { TipoFicha } from "@/generated/prisma/enums";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

/** Mãos / toque: Massoterapia */
export function IconeMassoterapia(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M10 10.5V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M13 10.5V6.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M16 12.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.1L4 15.6a1.6 1.6 0 0 1 2.4-2.1L7 14.2" />
    </svg>
  );
}

/** Gota / cabelo: Head Spa */
export function IconeHeadSpa(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c3.5 3.8 5.5 6.7 5.5 9.5A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.5C6.5 9.7 8.5 6.8 12 3z" />
      <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
      <path d="M5 21h14" />
    </svg>
  );
}

/** Folha / pele lisa: Depilação */
export function IconeDepilacao(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20c6-1 12-5 15.5-14.5C11 6 6 11 4 20z" />
      <path d="M4 20c3-5 7-9 11-11.5" />
    </svg>
  );
}

export function IconeCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export const ICONE_POR_TIPO: Record<TipoFicha, (p: IconProps) => React.JSX.Element> = {
  MASSOTERAPIA: IconeMassoterapia,
  HEAD_SPA: IconeHeadSpa,
  DEPILACAO: IconeDepilacao,
};
