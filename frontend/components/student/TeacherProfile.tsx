"use client";

import { useTeacherProfileQuery } from "@/queries/profile.queries";
import React from "react";
import Loading from "../common/Loading";
import Error from "../common/Error";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  Users,
  Video,
  GraduationCap,
  CalendarDays,
  MoveLeftIcon,
} from "lucide-react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface TeacherCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  totalStudents: number;
  totalLectures: number;
}

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profile: {
    avatarUrl: string | null;
    bio: string | null;
    headline: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    location: string | null;
  } | null;
  stats: {
    totalCourses: number;
    totalStudents: number;
    totalLectures: number;
  };
  courses: TeacherCourse[];
}

interface ApiResponse {
  success: boolean;
  teacherProfile: TeacherProfile;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ─── Social link ─────────────────────────────────────────────────────────── */
const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-xs text-neutral-500 hover:text-violet-600 transition-colors duration-200 font-medium"
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
      {label}
    </a>
  );
};

/* ─── Stat pill ───────────────────────────────────────────────────────────── */
const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) => (
  <div
    className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border ${color}`}
  >
    <Icon className="w-4 h-4 opacity-70" strokeWidth={1.8} />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
      {label}
    </span>
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────────── */
const TeacherProfile = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useTeacherProfileQuery(id);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const teacher = (data as ApiResponse | undefined)?.teacherProfile;
  if (!teacher) return <Error />;

  const p = teacher.profile;
  const avatarSrc = p?.avatarUrl || null;
  const hasSocials = p?.website || p?.github || p?.linkedin || p?.twitter;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ── Header breadcrumb ── */}
        <button
          onClick={() => window.history.back()}
          className="
    inline-flex items-center gap-2
    px-4 py-2
    rounded-xl
    text-sm font-semibold
    text-red-600
    bg-red-50
    hover:bg-red-100
    active:scale-95
    transition-all duration-200 mb-6
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
  "
        >
          <MoveLeftIcon size={18} />
          Go Back
        </button>
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Instructor
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            {teacher.name}
          </h1>
          {p?.headline && (
            <p className="text-sm text-neutral-500 font-medium mt-1">
              {p.headline}
            </p>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* LEFT: Profile card (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Identity */}
            <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={teacher.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-black/10 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-violet-500 flex items-center justify-center border border-violet-400 mb-4">
                    <span className="text-3xl font-bold text-white">
                      {initials(teacher.name)}
                    </span>
                  </div>
                )}
                <h2 className="text-lg font-bold text-neutral-900">
                  {teacher.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {teacher.email}
                </p>
                {p?.headline && (
                  <p className="text-xs text-neutral-500 font-medium mt-1.5 px-2 leading-relaxed">
                    {p.headline}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-2 pt-4 border-t border-black/5">
                {p?.location && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <MapPin
                      className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                      strokeWidth={1.8}
                    />
                    {p.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <CalendarDays
                    className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                    strokeWidth={1.8}
                  />
                  Joined {fmtDate(teacher.createdAt)}
                </div>
              </div>

              {/* Socials */}
              {hasSocials && (
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-black/5">
                  {p?.website && (
                    <SocialLink href={p.website} icon={Globe} label="Website" />
                  )}
                  {p?.github && (
                    <SocialLink
                      href={`https://github.com/${p.github}`}
                      icon={Github}
                      label={`github.com/${p.github}`}
                    />
                  )}
                  {p?.linkedin && (
                    <SocialLink
                      href={`https://linkedin.com/in/${p.linkedin}`}
                      icon={Linkedin}
                      label={`linkedin.com/in/${p.linkedin}`}
                    />
                  )}
                  {p?.twitter && (
                    <SocialLink
                      href={`https://x.com/${p.twitter}`}
                      icon={Twitter}
                      label={`@${p.twitter}`}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Stats
              </p>
              <div className="grid grid-cols-3 gap-2">
                <StatCard
                  icon={BookOpen}
                  value={teacher.stats.totalCourses}
                  label="Courses"
                  color="bg-violet-50 border-violet-200 text-violet-700"
                />
                <StatCard
                  icon={Users}
                  value={teacher.stats.totalStudents}
                  label="Students"
                  color="bg-emerald-50 border-emerald-200 text-emerald-700"
                />
                <StatCard
                  icon={Video}
                  value={teacher.stats.totalLectures}
                  label="Lectures"
                  color="bg-sky-50 border-sky-200 text-sky-700"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Bio + Courses (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Bio */}
            {p?.bio && (
              <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                  About
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {p.bio}
                </p>
              </div>
            )}

            {/* Courses */}
            <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Courses
                </p>
                <span className="text-[10px] text-neutral-400 font-medium">
                  {teacher.courses.length} available
                </span>
              </div>

              {teacher.courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 border border-dashed border-black/10 rounded-xl">
                  <GraduationCap
                    className="w-6 h-6 text-neutral-300 mb-2"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs text-neutral-400">No courses yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {teacher.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/student/courses/${course.id}`}
                    >
                      <div className="group flex gap-3 p-3 rounded-xl border border-black/6 hover:border-violet-200 hover:bg-violet-50/40 transition-all duration-200 cursor-pointer">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/8">
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-violet-700 transition-colors duration-200">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <Users className="w-3 h-3" strokeWidth={1.8} />
                              {course.totalStudents}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <Video className="w-3 h-3" strokeWidth={1.8} />
                              {course.totalLectures}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <CalendarDays
                                className="w-3 h-3"
                                strokeWidth={1.8}
                              />
                              {fmtDate(course.startDate)}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="shrink-0 flex flex-col items-end justify-between">
                          <span className="text-sm font-bold text-violet-600">
                            {course.price === 0 ? "Free" : fmt(course.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
