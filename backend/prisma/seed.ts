import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // SECURITY: Prevent seeding in production environment
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL: Database seeding is disabled in production.');
    process.exit(1);
  }

  console.log('🌱 Starting database seeding for NagarChitra BD...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Demo Users
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@nagarchitra.bd' },
    update: {},
    create: {
      email: 'citizen@nagarchitra.bd',
      name: 'তানভীর আহমেদ',
      passwordHash,
      role: 'CITIZEN',
      phone: '+8801711223344',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      location: 'মিরপুর ১০, ঢাকা',
      impactScore: 125,
      reportsCount: 4,
      verifiedCount: 8,
      resolvedCount: 3,
    },
  });

  const authority = await prisma.user.upsert({
    where: { email: 'authority@dncc.gov.bd' },
    update: {},
    create: {
      email: 'authority@dncc.gov.bd',
      name: 'প্রকৌশলী রফিকুল ইসলাম',
      passwordHash,
      role: 'AUTHORITY',
      phone: '+8801811998877',
      department: 'ঢাকা উত্তর সিটি কর্পোরেশন (সড়ক ও অবকাঠামো শাখা)',
      designation: 'সহকারী প্রকৌশলী',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      location: 'গুলশান ২, ঢাকা',
      impactScore: 480,
      reportsCount: 0,
      verifiedCount: 45,
      resolvedCount: 38,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nagarchitra.bd' },
    update: {},
    create: {
      email: 'admin@nagarchitra.bd',
      name: 'নগরচিত্র অ্যাডমিন',
      passwordHash,
      role: 'ADMIN',
      phone: '+8801911002233',
      department: 'সেন্ট্রাল মনিটরিং সেল',
      designation: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      location: 'ঢাকা',
      impactScore: 999,
    },
  });

  console.log(`✅ Seeded demo users: Citizen (${citizen.email}), Authority (${authority.email}), Admin (${admin.email})`);

  // 2. Seed Initial Civic Issues in Dhaka
  const issuesToSeed = [
    {
      trackingNumber: 'NC-2026-0412',
      title: 'Mirpur 10 - Large Road Pothole',
      titleBn: 'মিরপুর ১০ - রাস্তায় বড় গর্ত ও ভাঙা ড্রেন',
      description: 'A deep pothole of roughly 1.5 meters diameter has formed right next to Mirpur 10 roundabout heading toward Mirpur 2. Two rickshaws turned over yesterday during rain.',
      descriptionBn: 'মিরপুর ১০ নম্বর প্রধান গোলচত্বরের কাছে বড় একটি গর্ত ও ভাঙা ড্রেন তৈরি হয়েছে। গত কয়েকদিন ধরে এখানে চলাচল অত্যন্ত ঝুঁকিপূর্ণ হয়ে পড়েছে।',
      categoryId: 'road-damage',
      categoryName: 'Road Damage',
      categoryNameBn: 'সড়কের ক্ষতি ও খানাখন্দ',
      categoryGroup: 'Infrastructure',
      severity: 'HIGH' as const,
      status: 'SUBMITTED' as const,
      slaDays: 7,
      assignedAuthority: 'ঢাকা উত্তর সিটি কর্পোরেশন (DNCC)',
      assignedAuthorityBn: 'ঢাকা উত্তর সিটি কর্পোরেশন',
      assignedDepartment: 'সড়ক ও অবকাঠামো শাখা',
      assignedDepartmentBn: 'সড়ক ও অবকাঠামো শাখা',
      reporterId: citizen.id,
      communityConfirmations: 24,
      location: {
        latitude: 23.8061,
        longitude: 90.3615,
        address: 'মিরপুর ১০ গোলচত্বর, ঢাকা',
        addressBn: 'মিরপুর ১০ গোলচত্বর, ঢাকা',
        area: 'Mirpur',
        areaBn: 'মিরপুর',
        ward: 'Ward 10',
        wardBn: '১০ নং ওয়ার্ড',
      },
      photos: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
      ],
      timelineNote: 'নাগরিক কর্তৃক সমস্যাটি সরাসরি অ্যাপের মাধ্যমে নথিভুক্ত করা হয়েছে।',
    },
    {
      trackingNumber: 'NC-2026-0388',
      title: 'Dhanmondi Lake Walkway Broken Streetlights',
      titleBn: 'ধানমন্ডি লেক পার্কিং ও ওয়াকওয়ে লাইট বিকল',
      description: 'Five consecutive solar and LED lampposts along Sector 7 Dhanmondi lakeside walkway have been dark for 9 days. Evening walkers and women feel unsafe.',
      descriptionBn: 'ধানমন্ডি লেকের ৭ নম্বর সেক্টরসংলগ্ন ওয়াকওয়ের ৫টি সড়কবাতি টানা ৯ দিন ধরে নষ্ট হয়ে পড়ে আছে। সন্ধ্যায় পথচারীদের নিরাপত্তাহীনতা তৈরি হচ্ছে।',
      categoryId: 'streetlights',
      categoryName: 'Broken Streetlights',
      categoryNameBn: 'সড়কবাতি বিকল',
      categoryGroup: 'Infrastructure',
      severity: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const,
      slaDays: 5,
      assignedAuthority: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন (DSCC)',
      assignedAuthorityBn: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন',
      assignedDepartment: 'বিদ্যুৎ ও আলোক শাখা',
      assignedDepartmentBn: 'বিদ্যুৎ ও আলোক শাখা',
      assignedOfficer: 'প্রকৌশলী মশিউর রহমান',
      reporterId: citizen.id,
      communityConfirmations: 19,
      location: {
        latitude: 23.7461,
        longitude: 90.3742,
        address: 'রোড ৭/এ, ধানমন্ডি লেক, ঢাকা',
        addressBn: 'রোড ৭/এ, ধানমন্ডি লেক, ঢাকা',
        area: 'Dhanmondi',
        areaBn: 'ধানমন্ডি',
        ward: 'Ward 15',
        wardBn: '১৫ নং ওয়ার্ড',
      },
      photos: [
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      ],
      timelineNote: 'বিদ্যুৎ টিম পরিদর্শন করেছে, নতুন এলইডি ফিটিংস বসানোর কাজ চলমান।',
    },
    {
      trackingNumber: 'NC-2026-0351',
      title: 'Mohammadpur Salimullah Road Waterlogging Fixed',
      titleBn: 'মোহাম্মদপুর সলিমুল্লাহ রোড ড্রেন পরিষ্কার ও সংস্কার সম্পন্ন',
      description: 'Severe waterlogging caused by clogged underground drains. DWASA and City Corporation cleaning teams cleared the choke and repaired the manholes.',
      descriptionBn: 'ড্রেনেজ বন্ধ থাকায় রাস্তায় হাঁটু সমান পানি জমে থাকত। ওয়াসা ও সিটি কর্পোরেশন যৌথভাবে ড্রেন পরিষ্কার করেছে।',
      categoryId: 'drainage',
      categoryName: 'Water Drainage & Overflow',
      categoryNameBn: 'জলাবদ্ধতা ও ড্রেন উপচে পড়া',
      categoryGroup: 'Water & Drainage',
      severity: 'HIGH' as const,
      status: 'RESOLVED' as const,
      slaDays: 3,
      assignedAuthority: 'ঢাকা ওয়াসা ও DNCC',
      assignedAuthorityBn: 'ঢাকা ওয়াসা ও DNCC',
      assignedDepartment: 'পানি নিষ্কাশন অঞ্চল-৫',
      assignedDepartmentBn: 'পানি নিষ্কাশন অঞ্চল-৫',
      assignedOfficer: 'আরিফ মাহমুদ (সুপারভাইজার)',
      resolutionNote: 'ড্রেনের মুখ পরিষ্কার ও স্ল্যাব পুনঃস্থাপন করে পানি নিষ্কাশন স্বাভাবিক করা হয়েছে।',
      reporterId: citizen.id,
      communityConfirmations: 42,
      location: {
        latitude: 23.7658,
        longitude: 90.3584,
        address: 'সলিমুল্লাহ রোড, মোহাম্মদপুর, ঢাকা',
        addressBn: 'সলিমুল্লাহ রোড, মোহাম্মদপুর, ঢাকা',
        area: 'Mohammadpur',
        areaBn: 'মোহাম্মদপুর',
        ward: 'Ward 29',
        wardBn: '২৯ নং ওয়ার্ড',
      },
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80',
      ],
      timelineNote: 'সংস্কার সম্পন্ন হয়েছে। নাগরিক যাচাইকরণের জন্য উন্মুক্ত রাখা হয়েছে।',
    },
  ];

  for (const item of issuesToSeed) {
    const existing = await prisma.issue.findUnique({
      where: { trackingNumber: item.trackingNumber },
    });

    if (!existing) {
      await prisma.issue.create({
        data: {
          trackingNumber: item.trackingNumber,
          title: item.title,
          titleBn: item.titleBn,
          description: item.description,
          descriptionBn: item.descriptionBn,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          categoryNameBn: item.categoryNameBn,
          categoryGroup: item.categoryGroup,
          severity: item.severity,
          status: item.status,
          slaDays: item.slaDays,
          assignedAuthority: item.assignedAuthority,
          assignedAuthorityBn: item.assignedAuthorityBn,
          assignedDepartment: item.assignedDepartment,
          assignedDepartmentBn: item.assignedDepartmentBn,
          assignedOfficer: item.assignedOfficer,
          resolutionNote: item.resolutionNote,
          communityConfirmations: item.communityConfirmations,
          reporterId: item.reporterId,
          location: {
            create: item.location,
          },
          media: {
            create: item.photos.map((url) => ({
              url,
              type: 'IMAGE',
            })),
          },
          timeline: {
            create: {
              newStatus: item.status,
              changedById: authority.id,
              changedByName: authority.name,
              changedByRole: 'AUTHORITY',
              note: item.timelineNote,
              noteBn: item.timelineNote,
            },
          },
        },
      });
      console.log(`✅ Seeded issue: ${item.trackingNumber} (${item.title})`);
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
