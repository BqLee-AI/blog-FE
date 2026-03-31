import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserProfileForm } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  username: z.string().min(2, "用户名至少需要 2 个字符"),
  email: z.string().email("邮箱格式不正确"),
  bio: z.string(),
});

interface ProfileInfoProps {
  username: string;
  email: string;
  bio: string;
  avatar: string;
  isLoading?: boolean;
  onSave: (data: UserProfileForm) => Promise<void>;
}

export default function ProfileInfo({
  username,
  email,
  bio,
  avatar,
  isLoading = false,
  onSave,
}: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<UserProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username,
      email,
      bio,
    },
  });

  useEffect(() => {
    form.reset({
      username,
      email,
      bio,
    });
  }, [username, email, bio, form]);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: UserProfileForm) => {
    setError(null);

    try {
      await onSave(values);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败，请重试");
    }
  };

  const handleCancel = () => {
    form.reset({
    username,
    email,
    bio,
  });
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的信息</h2>
        <p className="text-gray-600 dark:text-gray-400">管理您的个人账号资料</p>
      </div>

      {/* 用户卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={username}
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{username}</h3>
            <p className="text-blue-100">{email}</p>
          </div>
        </div>
      </div>

      {/* 信息编辑区 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="请输入邮箱地址" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <Textarea placeholder="分享一点关于你自己的信息..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={isLoading || form.formState.isSubmitting}
                >
                  {isLoading || form.formState.isSubmitting ? "保存中..." : "保存更改"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                  取消
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            {/* 用户名 */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">用户名</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{username}</p>
            </div>

            {/* 邮箱 */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">邮箱地址</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{email}</p>
            </div>

            {/* 个人简介 */}
            <div className="pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">个人简介</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {bio || "暂无简介"}
              </p>
            </div>

            {/* 编辑按钮 */}
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              编辑信息
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
