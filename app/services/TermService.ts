
import { TermRepository } from "~/repositories/TermRepository";

type TermData = {
  title: string;
  content: string;
  folderId?: number | null;
  aliases?: string[];
};

export class TermService {
  private termRepository: TermRepository;

  constructor() {
    this.termRepository = new TermRepository();
  }

  // 用語を新規作成
  async createTerm(data: TermData) {
    // ここでバリデーションや追加のビジネスロジックを実装できる
    if (!data.title) {
      throw new Error("Title is required");
    }
    return await this.termRepository.create(data);
  }

  // IDで用語を取得
  async getTermById(id: number) {
    return await this.termRepository.findById(id);
  }

  // 用語を更新
  async updateTerm(id: number, data: Partial<TermData>) {
    return await this.termRepository.update(id, data);
  }

  // 用語を削除
  async deleteTerm(id: number) {
    return await this.termRepository.delete(id);
  }

  // キーワードで用語を検索
  async searchTerms(keyword: string) {
    if (!keyword) {
      return [];
    }
    return await this.termRepository.search(keyword);
  }
}
