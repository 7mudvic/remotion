import {Search, X} from 'lucide-react';

/**
 * Glass search bar — semi-transparent pill with backdrop blur, yellow
 * search icon. Centred in the available width.
 */
export const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mx-auto mt-2 flex w-full max-w-2xl items-center gap-3 rounded-full bg-white/10 px-5 py-3 backdrop-blur-2xl ring-1 ring-white/15 transition-shadow focus-within:ring-2 focus-within:ring-brand-yellow/50">
    <Search className="h-5 w-5 text-brand-yellow" strokeWidth={2.5} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ابحث عن صنف…"
      className="w-full bg-transparent font-cairo text-lg text-white placeholder:text-white/40 focus:outline-none"
    />
    {value ? (
      <button
        onClick={() => onChange('')}
        className="rounded-full p-1 text-white/70 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    ) : null}
  </div>
);
