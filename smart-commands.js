#!/usr/bin/env node

/**
 * Smart Command Dispatcher
 * Maps natural language commands to appropriate npm scripts
 * Usage: node smart-commands.js "start development"
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Command mappings
const commandMappings = {
  // Development commands
  'start development': 'start:dev',
  'start local server': 'start:dev',
  'start dev': 'start:dev',
  'start local': 'start:dev',
  'dev mode': 'start:dev',
  'development mode': 'start:dev',
  'local development': 'start:dev',
  
  // Production deployment commands
  'deploy on server': 'deploy:server',
  'deploy to production': 'deploy:server',
  'deploy production': 'deploy:server',
  'deploy server': 'deploy:server',
  'production deploy': 'deploy:server',
  'deploy to server': 'deploy:server',
  'go live': 'deploy:server',
  'push to production': 'deploy:server',
  
  // Database commands
  'sync database': 'sync:db',
  'sync db': 'sync:db',
  'database sync': 'sync:db',
  'update database': 'sync:db',
  
  // Utility commands
  'cleanup': 'cleanup',
  'clean up': 'cleanup',
  'remove unused files': 'cleanup',
  'clean project': 'cleanup',
  
  // Health check
  'health check': 'health:check',
  'check health': 'health:check',
  'test server': 'health:check',
  'ping server': 'health:check'
};

// Command descriptions
const commandDescriptions = {
  'start:dev': {
    description: 'Starts local development environment',
    explanation: 'We used the .env.local file to connect to your local PostgreSQL and spun up the dev servers using npm run dev. You can now develop safely with hot reloading enabled.'
  },
  'deploy:server': {
    description: 'Deploys to production server',
    explanation: "You're now running the production build. Your backend is live via PM2 on the server, and Vercel is handling the frontend build automatically."
  },
  'sync:db': {
    description: 'Synchronizes local database to production',
    explanation: 'Your local database has been synchronized to the production server, including schema and data changes.'
  },
  'cleanup': {
    description: 'Removes unused files and dependencies',
    explanation: 'Cleaned up node_modules, build artifacts, cache files, and analyzed unused dependencies to optimize your project.'
  },
  'health:check': {
    description: 'Checks if production server is healthy',
    explanation: 'Tested your production API endpoint to ensure it is responding correctly.'
  }
};

// Function to normalize command input
function normalizeCommand(input) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

// Function to find matching command
function findCommand(input) {
  const normalized = normalizeCommand(input);
  
  // Exact match
  if (commandMappings[normalized]) {
    return commandMappings[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(commandMappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

// Function to execute npm script
function executeCommand(npmScript) {
  const info = commandDescriptions[npmScript];
  
  log(`\n🤖 Smart Command Detected`, 'cyan');
  log(`📝 Command: ${info.description}`, 'blue');
  log(`🔄 Executing: npm run ${npmScript}`, 'yellow');
  log(`\n${'='.repeat(50)}`, 'cyan');
  
  const child = spawn('npm', ['run', npmScript], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    log(`\n${'='.repeat(50)}`, 'cyan');
    
    if (code === 0) {
      log(`✅ Command completed successfully!`, 'green');
      log(`\n💡 What happened:`, 'yellow');
      log(`${info.explanation}`, 'blue');
    } else {
      log(`❌ Command failed with exit code ${code}`, 'red');
      log(`Please check the output above for error details.`, 'yellow');
    }
    
    process.exit(code);
  });
  
  child.on('error', (error) => {
    log(`❌ Error executing command: ${error.message}`, 'red');
    process.exit(1);
  });
}

// Function to show help
function showHelp() {
  log(`\n🤖 Smart Command System Help`, 'cyan');
  log(`${'='.repeat(40)}`, 'cyan');
  log(`\nAvailable Commands:`, 'yellow');
  
  const groupedCommands = {
    'Development': [
      'start development',
      'start local server',
      'dev mode'
    ],
    'Production': [
      'deploy on server',
      'deploy to production',
      'go live'
    ],
    'Database': [
      'sync database',
      'update database'
    ],
    'Utilities': [
      'cleanup',
      'health check'
    ]
  };
  
  for (const [category, commands] of Object.entries(groupedCommands)) {
    log(`\n📁 ${category}:`, 'green');
    commands.forEach(cmd => {
      const npmScript = commandMappings[cmd];
      const desc = commandDescriptions[npmScript]?.description || '';
      log(`  • "${cmd}" → ${desc}`, 'blue');
    });
  }
  
  log(`\nUsage Examples:`, 'yellow');
  log(`  node smart-commands.js "start development"`, 'blue');
  log(`  node smart-commands.js "deploy on server"`, 'blue');
  log(`  node smart-commands.js "sync database"`, 'blue');
  
  log(`\nDirect npm commands:`, 'yellow');
  log(`  npm run start:dev`, 'blue');
  log(`  npm run deploy:server`, 'blue');
  log(`  npm run sync:db`, 'blue');
  
  log(`\n`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  const input = args.join(' ');
  const command = findCommand(input);
  
  if (command) {
    executeCommand(command);
  } else {
    log(`\n❌ Command not recognized: "${input}"`, 'red');
    log(`\n💡 Try one of these:`, 'yellow');
    log(`  • "start development"`, 'blue');
    log(`  • "deploy on server"`, 'blue');
    log(`  • "sync database"`, 'blue');
    log(`  • "cleanup"`, 'blue');
    log(`\nOr use --help to see all available commands.`, 'cyan');
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`\n❌ Unhandled promise rejection: ${reason}`, 'red');
  process.exit(1);
});

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  findCommand,
  executeCommand,
  commandMappings,
  commandDescriptions
};