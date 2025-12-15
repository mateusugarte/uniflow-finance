import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, TrendingUp, Shield, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-balance/5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-balance/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Uni Capital" className="h-10 w-auto" />
            <span className="font-bold text-xl text-gradient hidden sm:block">
              Uni Capital
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gradient">Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-sm font-medium text-accent-foreground mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Organize suas finanças com inteligência
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Suas finanças no{" "}
            <span className="text-gradient">controle total</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Acompanhe suas entradas e saídas, visualize gráficos detalhados e 
            tome decisões financeiras mais inteligentes com o Uni Capital.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/auth">
              <Button variant="gradient" size="xl" className="group">
                Começar Agora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="p-3 rounded-xl bg-income/10 text-income w-fit mb-6">
              <Wallet className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Controle Simples
            </h3>
            <p className="text-muted-foreground">
              Registre suas entradas e saídas de forma rápida e intuitiva. 
              Categorize por banco e acompanhe tudo em tempo real.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-6">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Gráficos Inteligentes
            </h3>
            <p className="text-muted-foreground">
              Visualize a evolução do seu saldo com gráficos modernos e 
              animados. Entenda suas finanças de forma visual.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="p-3 rounded-xl bg-balance/10 text-balance w-fit mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Dados Seguros
            </h3>
            <p className="text-muted-foreground">
              Suas informações financeiras são criptografadas e protegidas. 
              Apenas você tem acesso aos seus dados.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card-primary rounded-3xl p-12 md:p-16 text-center text-primary-foreground animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para organizar suas finanças?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Junte-se a milhares de pessoas que já controlam suas finanças 
            de forma inteligente com o Uni Capital.
          </p>
          <Link to="/auth">
            <Button
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
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
