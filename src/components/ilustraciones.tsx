/** Ilustraciones propias (SVG) para juguetes sin foto, categorías, portada y logo. */

export type TipoJuguete =
  | "oso" | "muneca" | "bloques" | "dado" | "rompecabezas" | "auto" | "tren"
  | "xilofono" | "volcan" | "pelota" | "cometa" | "trompo" | "regalo";

const REGLAS: [RegExp, TipoJuguete][] = [
  [/peluch|osito|oso\b|conejo/i, "oso"],
  [/mu[ñn]ec|doll/i, "muneca"],
  [/tren|locomotora/i, "tren"],
  [/auto|carro|veh[ií]c|camion|camión|carrera/i, "auto"],
  [/bloque|construc|ciudad|lego|armar/i, "bloques"],
  [/rompecabez|puzzle/i, "rompecabezas"],
  [/ajedrez|carta|mesa|dado|domin/i, "dado"],
  [/xil[oó]fono|music|piano|tambor/i, "xilofono"],
  [/ciencia|volc[aá]n|educa|experiment/i, "volcan"],
  [/pelota|bal[oó]n|f[uú]tbol|futbol|deporte/i, "pelota"],
  [/cometa|aire|libre|volar/i, "cometa"],
  [/trompo/i, "trompo"],
];

export function tipoDe(...textos: (string | undefined)[]): TipoJuguete {
  for (const t of textos) {
    if (!t) continue;
    for (const [re, tipo] of REGLAS) if (re.test(t)) return tipo;
  }
  return "regalo";
}

export const FONDO: Record<TipoJuguete, string> = {
  oso: "from-orange-100 to-yellow-50",
  muneca: "from-pink-100 to-rose-50",
  bloques: "from-sky-100 to-cyan-50",
  dado: "from-violet-100 to-fuchsia-50",
  rompecabezas: "from-green-100 to-lime-50",
  auto: "from-rose-100 to-orange-50",
  tren: "from-cyan-100 to-sky-50",
  xilofono: "from-yellow-100 to-amber-50",
  volcan: "from-orange-100 to-rose-50",
  pelota: "from-lime-100 to-green-50",
  cometa: "from-sky-100 to-indigo-50",
  trompo: "from-amber-100 to-orange-50",
  regalo: "from-fuchsia-100 to-pink-50",
};

const Sombra = ({ rx = 62 }: { rx?: number }) => <ellipse cx="100" cy="184" rx={rx} ry="8" fill="#2b2d42" opacity="0.08" />;

function Oso() {
  return (
    <>
      <Sombra />
      <circle cx="56" cy="58" r="21" fill="#B9783C" /><circle cx="144" cy="58" r="21" fill="#B9783C" />
      <circle cx="56" cy="58" r="11" fill="#F2B98A" /><circle cx="144" cy="58" r="11" fill="#F2B98A" />
      <ellipse cx="62" cy="172" rx="20" ry="13" fill="#B9783C" /><ellipse cx="138" cy="172" rx="20" ry="13" fill="#B9783C" />
      <ellipse cx="100" cy="138" rx="50" ry="44" fill="#C98B4F" />
      <ellipse cx="100" cy="146" rx="29" ry="29" fill="#F3D2A8" />
      <ellipse cx="52" cy="128" rx="14" ry="24" fill="#B9783C" transform="rotate(20 52 128)" />
      <ellipse cx="148" cy="128" rx="14" ry="24" fill="#B9783C" transform="rotate(-20 148 128)" />
      <circle cx="100" cy="84" r="48" fill="#D69A5E" />
      <ellipse cx="100" cy="100" rx="21" ry="16" fill="#F3D2A8" />
      <circle cx="80" cy="78" r="5.5" fill="#2b2d42" /><circle cx="120" cy="78" r="5.5" fill="#2b2d42" />
      <circle cx="82" cy="76" r="1.8" fill="#fff" /><circle cx="122" cy="76" r="1.8" fill="#fff" />
      <ellipse cx="100" cy="94" rx="8" ry="5.5" fill="#2b2d42" />
      <path d="M92 105q8 8 16 0" stroke="#2b2d42" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="68" cy="96" r="7" fill="#FF9AA2" opacity=".6" /><circle cx="132" cy="96" r="7" fill="#FF9AA2" opacity=".6" />
      <path d="M100 128l-20-9v18zM100 128l20-9v18z" fill="#E8403F" /><circle cx="100" cy="128" r="6" fill="#C42D2D" />
    </>
  );
}

function Muneca() {
  return (
    <>
      <Sombra rx={50} />
      <circle cx="58" cy="44" r="18" fill="#7B4A2B" /><circle cx="142" cy="44" r="18" fill="#7B4A2B" />
      <circle cx="58" cy="44" r="7" fill="#FF6FA3" /><circle cx="142" cy="44" r="7" fill="#FF6FA3" />
      <rect x="86" y="140" width="10" height="34" rx="5" fill="#F7C9A4" /><rect x="104" y="140" width="10" height="34" rx="5" fill="#F7C9A4" />
      <ellipse cx="91" cy="176" rx="12" ry="6" fill="#E8403F" /><ellipse cx="109" cy="176" rx="12" ry="6" fill="#E8403F" />
      <path d="M100 100c30 0 48 44 52 48H48c4-4 22-48 52-48z" fill="#FF6FA3" />
      <path d="M52 148h96l-6 8H58z" fill="#FF93BC" />
      <ellipse cx="68" cy="118" rx="9" ry="20" fill="#F7C9A4" transform="rotate(25 68 118)" />
      <ellipse cx="132" cy="118" rx="9" ry="20" fill="#F7C9A4" transform="rotate(-25 132 118)" />
      <circle cx="100" cy="76" r="38" fill="#F7C9A4" />
      <path d="M62 74c0-30 20-46 38-46s38 16 38 46c-8-16-20-24-38-24s-30 8-38 24z" fill="#7B4A2B" />
      <circle cx="86" cy="80" r="4.5" fill="#2b2d42" /><circle cx="114" cy="80" r="4.5" fill="#2b2d42" />
      <circle cx="87.5" cy="78.5" r="1.5" fill="#fff" /><circle cx="115.5" cy="78.5" r="1.5" fill="#fff" />
      <circle cx="76" cy="92" r="6" fill="#FF9AA2" opacity=".7" /><circle cx="124" cy="92" r="6" fill="#FF9AA2" opacity=".7" />
      <path d="M92 94q8 7 16 0" stroke="#C42D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  );
}

function Cubo({ x, y, c, l, t = 44 }: { x: number; y: number; c: string; l: string; t?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={t} height={t} rx="6" fill={c} />
      <path d={`M0 ${t * 0.22}h${t}v-${t * 0.1}a6 6 0 0 0-6-6H6a6 6 0 0 0-6 6z`} fill="#fff" opacity=".25" />
      <text x={t / 2} y={t * 0.7} textAnchor="middle" fontSize={t * 0.5} fontWeight="800" fill="#fff" fontFamily="sans-serif">{l}</text>
    </g>
  );
}
function Bloques() {
  return (
    <>
      <Sombra />
      <Cubo x={34} y={134} c="#FF6A1A" l="A" t={50} /><Cubo x={90} y={134} c="#4FB3E8" l="B" t={50} />
      <Cubo x={146} y={140} c="#7BC96F" l="C" t={44} />
      <Cubo x={60} y={82} c="#FFC93C" l="1" t={50} /><Cubo x={118} y={86} c="#FF6FA3" l="2" t={46} />
      <g transform="rotate(-10 100 40)"><Cubo x={80} y={26} c="#8B5CF6" l="★" t={50} /></g>
    </>
  );
}

function Dado() {
  const punto = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#2b2d42" />;
  return (
    <>
      <Sombra />
      <g transform="rotate(-8 70 120)">
        <rect x="26" y="76" width="86" height="86" rx="18" fill="#fff" stroke="#E5DDF5" strokeWidth="3" />
        {[[48, 98], [90, 98], [69, 119], [48, 140], [90, 140]].map(([x, y]) => punto(x, y))}
      </g>
      <g transform="rotate(14 140 100)">
        <rect x="104" y="42" width="66" height="66" rx="14" fill="#8B5CF6" />
        {[[124, 62], [150, 88], [137, 75]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" fill="#fff" />)}
      </g>
      <path d="M150 178c-10 0-14-8-12-16 2-6 6-8 6-14a8 8 0 1 1 12 0c0 6 4 8 6 14 2 8-2 16-12 16z" fill="#FF6A1A" />
      <ellipse cx="150" cy="180" rx="16" ry="4" fill="#E8540A" />
    </>
  );
}

function Rompecabezas() {
  return (
    <>
      <Sombra />
      <g>
        <path d="M30 40h50a10 10 0 1 1 20 0h30v40a10 10 0 1 0 0 20v10H30z" fill="#4FB3E8" />
        <path d="M100 40h70v50H130a10 10 0 1 0 0 20v-10H100v-20a10 10 0 1 1 0-20z" fill="#FFC93C" transform="translate(0 0)" />
        <path d="M30 110h50a10 10 0 1 1 20 0v50H30z" fill="#FF6FA3" />
        <path d="M100 110h30a10 10 0 1 0 20 0h20v50h-70z" fill="#7BC96F" />
      </g>
      <circle cx="62" cy="70" r="8" fill="#fff" opacity=".6" /><circle cx="150" cy="130" r="8" fill="#fff" opacity=".6" />
    </>
  );
}

function Auto() {
  return (
    <>
      <Sombra rx={74} />
      <path d="M24 130c0-16 10-24 24-26l22-30c4-5 9-8 16-8h30c8 0 14 3 18 8l22 30c14 2 22 10 22 26v14H24z" fill="#E8403F" />
      <path d="M74 80h26v26H62zM110 80h20c4 0 7 2 9 5l16 21h-45z" fill="#BFE6FA" />
      <rect x="24" y="132" width="152" height="16" rx="6" fill="#C42D2D" />
      <rect x="150" y="124" width="22" height="9" rx="4" fill="#FFE066" />
      <circle cx="62" cy="152" r="22" fill="#2b2d42" /><circle cx="62" cy="152" r="10" fill="#C8CCD6" />
      <circle cx="144" cy="152" r="22" fill="#2b2d42" /><circle cx="144" cy="152" r="10" fill="#C8CCD6" />
      <path d="M96 132h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".5" />
    </>
  );
}

function Tren() {
  return (
    <>
      <Sombra rx={78} />
      <rect x="28" y="96" width="92" height="52" rx="10" fill="#4FB3E8" />
      <rect x="22" y="132" width="156" height="14" rx="5" fill="#2b2d42" />
      <rect x="120" y="68" width="52" height="80" rx="10" fill="#FF6A1A" />
      <rect x="130" y="78" width="32" height="26" rx="6" fill="#BFE6FA" />
      <rect x="44" y="62" width="22" height="36" rx="4" fill="#2b2d42" /><rect x="38" y="54" width="34" height="10" rx="5" fill="#FFC93C" />
      <circle cx="62" cy="38" r="12" fill="#fff" opacity=".8" /><circle cx="82" cy="22" r="9" fill="#fff" opacity=".6" />
      <circle cx="148" cy="38" r="0" />
      {[56, 92, 144].map((x) => (<g key={x}><circle cx={x} cy="152" r="17" fill="#FFC93C" stroke="#2b2d42" strokeWidth="5" /><circle cx={x} cy="152" r="4" fill="#2b2d42" /></g>))}
      <rect x="24" y="108" width="22" height="22" rx="11" fill="#E8F5FD" />
    </>
  );
}

function Xilofono() {
  const barras = [["#E8403F", 150], ["#FF6A1A", 138], ["#FFC93C", 126], ["#7BC96F", 114], ["#4FB3E8", 102], ["#8B5CF6", 90]] as const;
  return (
    <>
      <Sombra />
      <rect x="22" y="150" width="156" height="10" rx="5" fill="#B9783C" /><rect x="34" y="70" width="10" height="90" rx="5" fill="#B9783C" /><rect x="156" y="70" width="10" height="90" rx="5" fill="#B9783C" />
      {barras.map(([c, h], i) => (<rect key={c} x={36 + i * 22} y={158 - h} width="18" height={h - 6} rx="6" fill={c} />))}
      {barras.map(([c, h], i) => (<circle key={`p${c}`} cx={45 + i * 22} cy={158 - h + 12} r="3" fill="#fff" opacity=".7" />))}
      <g transform="rotate(25 150 40)"><rect x="146" y="14" width="6" height="56" rx="3" fill="#D69A5E" /><circle cx="149" cy="14" r="9" fill="#FF6FA3" /></g>
      <g transform="rotate(-25 50 40)"><rect x="46" y="14" width="6" height="56" rx="3" fill="#D69A5E" /><circle cx="49" cy="14" r="9" fill="#4FB3E8" /></g>
    </>
  );
}

function Volcan() {
  return (
    <>
      <Sombra rx={76} />
      <circle cx="100" cy="38" r="14" fill="#fff" opacity=".8" /><circle cx="120" cy="22" r="10" fill="#fff" opacity=".6" /><circle cx="84" cy="22" r="8" fill="#fff" opacity=".6" />
      <path d="M30 176L82 70h36l52 106z" fill="#9C5B34" />
      <path d="M82 70h36l8 20c-10 8-20 0-26 8-6-8-16 0-26-8z" fill="#FF6A1A" />
      <path d="M100 98c-4 14-2 26-8 40 8-4 14-4 16 0 4-14-2-26-8-40z" fill="#FF8540" />
      <path d="M60 176l16-34h12l-10 34z" fill="#7C4524" />
      <circle cx="132" cy="150" r="6" fill="#7C4524" /><circle cx="150" cy="168" r="5" fill="#7C4524" />
      <circle cx="68" cy="50" r="4" fill="#FFC93C" /><circle cx="136" cy="44" r="3.5" fill="#FF6A1A" />
    </>
  );
}

function Pelota() {
  return (
    <>
      <Sombra rx={56} />
      <circle cx="100" cy="98" r="72" fill="#fff" stroke="#2b2d42" strokeWidth="5" />
      <path d="M100 62l24 18-9 28H85l-9-28z" fill="#2b2d42" />
      <path d="M100 62V34M124 80l28-10M115 108l16 24M85 108l-16 24M76 80L48 70" stroke="#2b2d42" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 34l22-4M100 34L78 30M152 70l8 22M48 70l-8 22M131 132l-6 22M69 132l6 22" stroke="#2b2d42" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 56q10-14 26-20" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".7" />
    </>
  );
}

function Cometa() {
  return (
    <>
      <path d="M100 18l54 62-54 74-54-74z" fill="#FF6FA3" />
      <path d="M100 18l54 62H100z" fill="#FFC93C" /><path d="M100 80H46l54-62z" fill="#4FB3E8" /><path d="M100 80l-54 0 54 74z" fill="#7BC96F" />
      <path d="M100 18v136M46 80h108" stroke="#fff" strokeWidth="3" opacity=".7" />
      <path d="M100 154c-10 14 10 22 0 34s10 12 4 12" stroke="#2b2d42" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[[100, 168, "#E8403F"], [96, 182, "#FFC93C"], [104, 194, "#4FB3E8"]].map(([x, y, c]) => (
        <path key={String(y)} d={`M${Number(x) - 12} ${Number(y) - 7}l12 7 12-7v14l-12-7-12 7z`} fill={String(c)} />
      ))}
    </>
  );
}

function Trompo() {
  return (
    <>
      <Sombra rx={44} />
      <rect x="94" y="14" width="12" height="30" rx="6" fill="#B9783C" />
      <ellipse cx="100" cy="64" rx="56" ry="22" fill="#FFC93C" />
      <path d="M44 64c0 14 20 34 56 34s56-20 56-34c0 22-16 48-44 70l-12 40-12-40C60 112 44 86 44 64z" fill="#FF6A1A" />
      <path d="M58 76c10 8 24 14 42 14s32-6 42-14c-2 8-6 16-12 24-8 4-18 6-30 6s-22-2-30-6c-6-8-10-16-12-24z" fill="#4FB3E8" />
      <path d="M100 174l8-26h-16z" fill="#2b2d42" />
      <ellipse cx="82" cy="60" rx="14" ry="5" fill="#fff" opacity=".5" />
    </>
  );
}

function Regalo() {
  return (
    <>
      <Sombra />
      <rect x="40" y="86" width="120" height="86" rx="10" fill="#FF6FA3" />
      <rect x="32" y="66" width="136" height="30" rx="9" fill="#FF93BC" />
      <rect x="90" y="66" width="20" height="106" fill="#FFC93C" />
      <path d="M100 66c-30-30-56-4-34 6zM100 66c30-30 56-4 34 6z" fill="#FFC93C" />
      <circle cx="100" cy="64" r="9" fill="#F5A800" />
    </>
  );
}

const MAPA: Record<TipoJuguete, () => React.JSX.Element> = {
  oso: Oso, muneca: Muneca, bloques: Bloques, dado: Dado, rompecabezas: Rompecabezas, auto: Auto,
  tren: Tren, xilofono: Xilofono, volcan: Volcan, pelota: Pelota, cometa: Cometa, trompo: Trompo, regalo: Regalo,
};

export function Ilustracion({ tipo, className = "" }: { tipo: TipoJuguete; className?: string }) {
  const Comp = MAPA[tipo];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <Comp />
    </svg>
  );
}

/** Logo de la tienda: un trompo. */
export function LogoTrompo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <rect x="94" y="10" width="12" height="30" rx="6" fill="#fff" />
      <ellipse cx="100" cy="62" rx="62" ry="24" fill="#FFE066" />
      <path d="M38 62c0 16 22 38 62 38s62-22 62-38c0 26-18 54-50 78l-12 46-12-46C56 116 38 88 38 62z" fill="#fff" />
      <path d="M52 76c12 9 28 16 48 16s36-7 48-16c-2 10-7 20-14 28-8 5-20 8-34 8s-26-3-34-8c-7-8-12-18-14-28z" fill="#4FB3E8" />
    </svg>
  );
}

/** Composición grande para la portada. */
export function ArtePortada({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 430" className={className} aria-hidden="true">
      <circle cx="290" cy="196" r="170" fill="#fff" opacity=".22" />
      <circle cx="290" cy="196" r="120" fill="#fff" opacity=".2" />
      <g className="flotar" style={{ ["--giro" as string]: "0deg" }}><g transform="translate(150 50) scale(1.55)"><Oso /></g></g>
      <g className="flotar [animation-delay:-1.4s]" style={{ ["--giro" as string]: "0deg" }}><g transform="translate(330 170) scale(1.25)"><Auto /></g></g>
      <g className="flotar [animation-delay:-2.2s]" style={{ ["--giro" as string]: "0deg" }}><g transform="translate(20 190) scale(1)"><Bloques /></g></g>
      <g className="flotar [animation-delay:-0.6s]" style={{ ["--giro" as string]: "0deg" }}><g transform="translate(398 -6) scale(.8)"><Cometa /></g></g>
      <g fill="#FFE066"><path d="M70 60l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" /><path d="M500 250l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" /><circle cx="470" cy="120" r="6" /><circle cx="40" cy="140" r="5" /></g>
    </svg>
  );
}
