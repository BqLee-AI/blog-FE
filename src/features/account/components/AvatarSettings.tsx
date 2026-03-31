import { useState, useRef } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface AvatarSettingsProps {
  currentAvatar: string;
  username: string;
  isLoading?: boolean;
  onAvatarChange: (avatarUrl: string) => Promise<void>;
}

export default function AvatarSettings({
  currentAvatar,
  username,
  isLoading = false,
  onAvatarChange,
}: AvatarSettingsProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }

    // 验证文件大小（限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过 5MB");
      return;
    }

    // 生成预览
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      setError(null);
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    setError(null);
    try {
      await onAvatarChange(preview);
      setSuccess(true);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的头像</h2>
        <p className="text-gray-600 dark:text-gray-400">上传和管理您的头像</p>
      </div>

      {/* 头像编辑卡片 */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        {/* 成功提示 */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-green-600 dark:text-green-400 text-sm">✓ 头像上传成功！</p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 头像预览 */}
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40">
              <img
                src={preview || currentAvatar}
                alt={username}
                className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover shadow-lg dark:border-gray-700"
              />
              {preview && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-blue-500 bg-blue-500/10">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                    预览
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 上传控制 */}
          <div className="flex-1 flex flex-col justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading || isLoading}
              className="hidden"
            />

            <div className="space-y-4">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isLoading}
                className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <UploadIcon className="w-5 h-5" />
                <span>{isUploading ? "上传中..." : "选择图片"}</span>
              </Button>

              {preview && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading || isLoading}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    {isUploading ? "保存中..." : "保存"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUploading || isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">✓ 支持格式：JPG、PNG、GIF</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">✓ 文件大小：不超过 5MB</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">✓ 建议尺寸：200×200 像素或更大</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 预设头像 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">或选择预设头像</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=avatar${i}`;
                setPreview(avatarUrl);
              }}
              className="relative group"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=avatar${i}`}
                alt={`预设头像 ${i}`}
                className="w-full aspect-square rounded-lg border-2 border-gray-200 object-cover transition-colors hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/10">
                <span className="text-sm font-semibold text-white opacity-0 group-hover:opacity-100">选择</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
