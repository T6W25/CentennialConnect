"use client"
import '../styles/Message.css';

const Message = ({ variant = "info", children, onClose }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "error":
        return "bg-red-100 text-red-700 border-red-200"
      case "success":
        return "bg-green-100 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  return (
    <div className={`p-4 mb-4 rounded-md border ${getVariantClasses()} relative`}>
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
      )}
      <div className="flex items-center">
        {variant === "error" && <span className="mr-2">❌</span>}
        {variant === "success" && <span className="mr-2">✅</span>}
        {variant === "warning" && <span className="mr-2">⚠️</span>}
        {variant === "info" && <span className="mr-2">ℹ️</span>}
        <span>{children}</span>
      </div>
    </div>
  )
}

export default Message

