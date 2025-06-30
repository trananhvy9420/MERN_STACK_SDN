
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="login" 
              className="transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Đăng ký
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;