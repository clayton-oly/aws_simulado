import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo ao Simulado AWS!</h1>
      <p>Clique no botão abaixo para iniciar o simulado.</p>
      <Link href="simulado">
        <button>Iniciar Simulado</button>
      </Link>
    </div>
  );
}