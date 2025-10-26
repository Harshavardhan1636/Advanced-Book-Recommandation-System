'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface AddToListModalProps {
  bookTitle: string;
  onClose: () => void;
  onAdd: (listName: string) => Promise<void>;
}

export function AddToListModal({ bookTitle, onClose, onAdd }: AddToListModalProps) {
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lists, setLists] = useState(['Currently Reading', 'Want to Read', 'Read']);

  const handleAddNew = () => {
    if (newListName.trim() && !lists.includes(newListName)) {
      setLists([...lists, newListName]);
      setSelectedLists([...selectedLists, newListName]);
      setNewListName('');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      for (const list of selectedLists) {
        await onAdd(list);
      }
      toast.success(`Added to ${selectedLists.length} list${selectedLists.length !== 1 ? 's' : ''}`);
      onClose();
    } catch (error) {
      toast.error('Failed to add to lists');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold">Add to Reading List</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Adding: <span className="font-semibold text-slate-900 dark:text-white">{bookTitle}</span>
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {lists.map((list) => (
              <label
                key={list}
                className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedLists.includes(list)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLists([...selectedLists, list]);
                    } else {
                      setSelectedLists(selectedLists.filter((l) => l !== list));
                    }
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3 text-slate-900 dark:text-white">{list}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name"
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
              onKeyPress={(e) => e.key === 'Enter' && handleAddNew()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              disabled={!newListName.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handleSubmit}
              disabled={selectedLists.length === 0 || isLoading}
            >
              {isLoading ? 'Adding...' : 'Add to Lists'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
