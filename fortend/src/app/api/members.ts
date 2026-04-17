
import { get, post, put, del } from './client';
import type {
  MemberInfo,
  MemberListItem,
  MemberCreate,
  MemberUpdate,
} from './types';

// 获取家庭成员列表
export async function getMembers() {
  return get<MemberListItem[]>('/members');
}

// 添加家庭成员
export async function createMember(data: MemberCreate) {
  return post<MemberInfo>('/members', data);
}

// 获取本人档案
export async function getSelfMember() {
  return get<MemberInfo>('/members/self');
}

// 获取成员详情
export async function getMember(memberId: number) {
  return get<MemberInfo>(`/members/${memberId}`);
}

// 更新成员信息
export async function updateMember(memberId: number, data: MemberUpdate) {
  return put<MemberInfo>(`/members/${memberId}`, data);
}

// 删除成员
export async function deleteMember(memberId: number) {
  return del(`/members/${memberId}`);
}

