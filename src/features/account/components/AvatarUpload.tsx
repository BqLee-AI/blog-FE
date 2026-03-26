import { useState, useRef } from "react";

interface AvatarUploadProps {
  currentAvatar: string;
  username: string;
  onAvatarChange: (avatarUrl: string) => Promise<void>;
  isLoading?: boolean;
}

export default function AvatarUpload({
  currentAvatar,
  username,
  onAvatarChange,
  isLoading = false,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    try {
      // 这里可以将图片上传到服务器
      // 目前使用 base64 或直接使用 preview 作为头像 URL
      await onAvatarChange(preview);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
    <div className="space-y-4">
      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* 头像预览和上传 */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="shrink-0">
          <div className="relative group cursor-pointer hover-button">
            {/* 当前头像 */}
            <img
              src={preview || currentAvatar}
              alt={username}
              className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover transition-all duration-300 group-hover:border-blue-500"
            />

            {/* 上传状态指示 */}
            {preview && (
              <div className="absolute inset-0 rounded-full bg-blue-500/10 border-4 border-blue-500 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                  预览
                </span>
              </div>
            )}

            {/* 悬停提示遮罩 */}
            {!preview && (
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium">点击上传</span>
              </div>
            )}
          </div>
        </div>

        {/* 上传控制 */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || isLoading}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="hover-button w-full px-4 py-2 bg-blue-600 text-white rounded-lg dark:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-3"
          >
            {isUploading ? "上传中..." : "选择图片"}
          </button>

          {preview && (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={isUploading || isLoading}
                className="hover-button flex-1 px-4 py-2 bg-green-600 text-white rounded-lg dark:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isUploading ? "保存中..." : "保存"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUploading || isLoading}
                className="hover-button flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg dark:bg-gray-600 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                取消
              </button>
            </div>
          )}

          {/* 帮助文本 */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            支持 JPG、PNG、GIF 等格式，建议使用至少 200x200 像素的正方形图片，文件大小不超过 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
