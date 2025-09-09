const fs = require('fs');
const path = require('path');

// FontAwesome to Heroicons mapping
const iconMappings = {
  'fas fa-users': 'UserGroupIcon',
  'fas fa-calendar-alt': 'CalendarIcon', 
  'fas fa-building': 'BuildingOfficeIcon',
  'fas fa-bullseye': 'TargetIcon',
  'fas fa-eye': 'EyeIcon',
  'fas fa-heart': 'HeartIcon',
  'fas fa-lightbulb': 'LightBulbIcon',
  'fas fa-handshake': 'HandshakeIcon',
  'fas fa-star': 'StarIcon',
  'fas fa-award': 'AwardIcon',
  'fas fa-globe-americas': 'GlobeAltIcon',
  'fas fa-play': 'PlayIcon',
  'fas fa-video': 'VideoCameraIcon',
  'fas fa-arrow-right': 'ArrowRightIcon',
  'fas fa-cube': 'CubeIcon'
};

// Files to process
const filesToProcess = [
  'src/pages/AboutPage.jsx',
  'src/components/VideoPlayer.jsx',
  'src/pages/ContactPage.jsx',
  'src/pages/AlumniPage.jsx',
  'src/pages/StudentsPage.jsx'
];

function replaceFontAwesome(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace FontAwesome classes with Heroicons
    Object.entries(iconMappings).forEach(([faClass, heroIcon]) => {
      const regex = new RegExp(`<i className="${faClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"></i>`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `<${heroIcon} className="w-5 h-5" />`);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
filesToProcess.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    replaceFontAwesome(fullPath);
  } else {
    console.log(`⚠️  File not found: ${fullPath}`);
  }
});

console.log('🎉 FontAwesome replacement complete!');
