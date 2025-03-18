import { Schema, model } from 'mongoose';

export interface IProduct{
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Название продукта обязательно'],
    unique: true,
    minlength: [2, 'Название должно содержать минимум 2 символа'],
    maxlength: [30, 'Название должно содержать максимум 30 символов'],
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Имя файла изображения обязательно'],
    },
    originalName: {
      type: String,
      required: [true, 'Оригинальное имя файла обязательно'],
    },
  },
  category: {
    type: String,
    required: [true, 'Категория продукта обязательна'],
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Цена не может быть отрицательной'],
  },
});

export default model<IProduct>('Product', productSchema);
