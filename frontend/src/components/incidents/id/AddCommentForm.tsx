// frontend/src/components/incidents/id/AddCommentForm.tsx
import React, { useState } from "react";
import { MessageSquarePlus, Send, X, Lock } from "lucide-react";

interface AddCommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
    submitButtonText?: string;
    isSubmitting?: boolean;
    isIncidentClosed?: boolean;
    className?: string;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({
    onSubmit,
    onCancel,
    placeholder = "Add a comment...",
    submitButtonText = "Add Comment",
    isSubmitting = false,
    isIncidentClosed = false,
    className = ""
}) => {
    const [content, setContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting || isIncidentClosed) return;

        try {
            await onSubmit(content.trim());
            setContent("");
            setIsExpanded(false);
        } catch (error) {
            console.error("Failed to submit comment:", error);
        }
    };

    const handleCancel = () => {
        setContent("");
        setIsExpanded(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleFocus = () => {
        if (isIncidentClosed) return;
        setIsExpanded(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (content.trim() && !isSubmitting && !isIncidentClosed) {
                handleSubmit(e as any);
            }
        }
    };

    // Show disabled state when incident is closed
    if (isIncidentClosed) {
        return (
            <div className={`${className}`}>
                <div className="w-full flex items-center gap-3 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">
                        Comments are disabled - incident is closed
                    </span>
                </div>
            </div>
        );
    }

    if (!isExpanded) {
        return (
            <div className={`${className}`}>
                <button
                    onClick={handleFocus}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200 text-left"
                >
                    <MessageSquarePlus className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 text-sm">{placeholder}</span>
                </button>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`${placeholder} (Press Enter to send, Shift+Enter for new line)`}
                    className="w-full p-4 border-0 rounded-t-lg resize-none focus:outline-none focus:ring-0 text-sm"
                    rows={3}
                    autoFocus
                    disabled={isSubmitting}
                    maxLength={2000}
                />
                <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="text-xs text-gray-500">
                        {content.length}/2000 characters
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors duration-200"
                            disabled={isSubmitting}
                        >
                            <X className="h-3 w-3" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                        >
                            <Send className="h-3 w-3" />
                            {isSubmitting ? "Adding..." : submitButtonText}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};