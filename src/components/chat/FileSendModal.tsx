interface FileSendModalProps {
  imageUrl: string;
  fileName: string;
  fileSize: string;
  onCancel: () => void;
  onSend: () => void;
}

const FileSendModal = ({
  imageUrl,
  fileName,
  fileSize,
  onCancel,
  onSend,
}: FileSendModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-4 w-[18rem] text-center shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onCancel}
        >
          ✕
        </button>

        {/* 이미지 미리보기 */}
        <img
          src={imageUrl}
          alt="preview"
          className="w-32 h-32 object-cover rounded mx-auto mb-2"
        />
        <div className="font-medium">{fileName}</div>
        <div className="text-sm text-gray-500 mb-4">{fileSize}</div>

        {/* 전송 버튼 */}
        <button
          className="w-full bg-gr-500 text-white py-2 rounded hover:bg-gr-600 transition"
          onClick={onSend}
        >
          1개 전송
        </button>
      </div>
    </div>
  );
};

export default FileSendModal;
