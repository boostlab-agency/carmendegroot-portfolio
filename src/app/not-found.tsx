import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export const metadata = { title: "Pagina niet gevonden", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center bg-paper">
      <div className="container-site py-24">
        <p className="eyebrow">Fout 404</p>
        <h1 className="mt-8 max-w-4xl text-display-xl font-medium">
          Deze pagina is <em className="em-serif band">zoekgeraakt</em>.
        </h1>
        <p className="mt-8 max-w-md text-lead text-stone">
          De pagina die je zoekt bestaat niet (meer). Misschien vind je wat je zoekt via de homepage of het projectoverzicht.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses("primary", "lg")}>
            Naar de homepage
          </Link>
          <Link href="/projecten" className={buttonClasses("secondary", "lg")}>
            Bekijk projecten
          </Link>
        </div>
      </div>
    </main>
  );
}
