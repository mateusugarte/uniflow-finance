import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, TrendingUp, Shield, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Uni Capital" className="h-10 w-auto" />
            <span className="font-bold text-xl text-foreground hidden sm:block">
              Uni Capital
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-sm font-medium text-accent-foreground mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Organize suas finanças
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Suas finanças no{" "}
            <span className="text-primary">controle total</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Acompanhe suas entradas e saídas, visualize gráficos detalhados e 
            tome decisões financeiras mais inteligentes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/auth">
              <Button size="lg" className="group">
                Começar Agora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="p-3 rounded-lg bg-income/10 text-income w-fit mb-4">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Controle Simples
            </h3>
            <p className="text-muted-foreground text-sm">
              Registre suas entradas e saídas de forma rápida e intuitiva.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Gráficos Inteligentes
            </h3>
            <p className="text-muted-foreground text-sm">
              Visualize a evolução do seu saldo com gráficos modernos.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="p-3 rounded-lg bg-balance/10 text-balance w-fit mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Dados Seguros
            </h3>
            <p className="text-muted-foreground text-sm">
              Suas informações são criptografadas e protegidas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-2xl p-10 md:p-14 text-center text-primary-foreground animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para organizar suas finanças?
          </h2>
          <p className="opacity-90 mb-6 max-w-lg mx-auto">
            Junte-se a milhares de pessoas que já controlam suas finanças 
            de forma inteligente.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Criar Conta Grátis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Uni Capital" className="h-8 w-auto" />
            <span className="text-sm text-muted-foreground">
              © 2024 Uni Capital. Todos os direitos reservados.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
