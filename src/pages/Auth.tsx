import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRules = [
    { label: "Mínimo 8 caracteres", valid: signupData.password.length >= 8 },
    { label: "Uma letra maiúscula", valid: /[A-Z]/.test(signupData.password) },
    { label: "Um número", valid: /\d/.test(signupData.password) },
    { label: "Um caractere especial", valid: /[!@#$%^&*(),.?":{}|<>]/.test(signupData.password) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.loginEmail = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.loginEmail = "Email inválido";
    }
    if (!loginData.password) {
      newErrors.loginPassword = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.name.trim()) {
      newErrors.signupName = "Nome é obrigatório";
    }
    if (!signupData.email) {
      newErrors.signupEmail = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.signupEmail = "Email inválido";
    }
    if (!isPasswordValid) {
      newErrors.signupPassword = "Senha não atende aos requisitos";
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.signupConfirmPassword = "Senhas não conferem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Login realizado com sucesso!");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.name);
    
    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Conta criada com sucesso! Verifique seu email.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm sm:max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain"
            />
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xl">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 mb-5 sm:mb-6 bg-secondary">
              <TabsTrigger
                value="login"
                className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="animate-fade-in">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className={cn(
                        "pl-10 h-11 text-base",
                        errors.loginEmail && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.loginEmail && (
                    <p className="text-xs text-destructive">{errors.loginEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className={cn(
                        "pl-10 pr-10 h-11 text-base",
                        errors.loginPassword && "border-destructive"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <p className="text-xs text-destructive">{errors.loginPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Não tem uma conta?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta
                </button>
              </p>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="animate-fade-in">
              <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      className={cn(
                        "pl-10 h-11 text-base",
                        errors.signupName && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.signupName && (
                    <p className="text-xs text-destructive">{errors.signupName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      className={cn(
                        "pl-10 h-11 text-base",
                        errors.signupEmail && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.signupEmail && (
                    <p className="text-xs text-destructive">{errors.signupEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      className={cn(
                        "pl-10 pr-10 h-11 text-base",
                        errors.signupPassword && "border-destructive"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupData.password && (
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {passwordRules.map((rule, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-1 text-xs transition-colors",
                            rule.valid ? "text-income" : "text-muted-foreground"
                          )}
                        >
                          {rule.valid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="text-sm">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      className={cn(
                        "pl-10 h-11 text-base",
                        errors.signupConfirmPassword && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.signupConfirmPassword && (
                    <p className="text-xs text-destructive">{errors.signupConfirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Já tem uma conta?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Entrar
                </button>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
