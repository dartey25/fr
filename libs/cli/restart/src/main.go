package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"

	"path/filepath"

	"time"

	"golang.org/x/sys/windows/svc"
	"golang.org/x/sys/windows/svc/mgr"
)

func main() {
	serviceNamePtr := flag.String("s", "md-web-api", "Specify the service name")
	prismaPushFlagPtr := flag.Bool("push", false, "Run prisma db push")
	prismaMigrateFlagPtr := flag.Bool("migrate", false, "Run prisma migrate")
	prismaDirFlagPtr := flag.String("d", "", "Directory to prisma schema, default is %HOME_DIR%/AppData/Roaming/MD-Web-Extended/EUR/server/prisma")
	generateFlagPtr := flag.Bool("skipg", false, "Not to generate prisma types on migrate and push (if set)")
	flag.Parse()

	if *serviceNamePtr == "" {
		fmt.Println("Error: Service name not provided. Use -s <service_name>")
		flag.PrintDefaults()
		os.Exit(1)
	}

	serviceName := *serviceNamePtr
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error getting user home directory:", err)
		os.Exit(1)
	}
	logFilePath := filepath.Join(homeDir, "log.txt")

	// Open log file for writing, create if not exists
	logFile, err := os.OpenFile(logFilePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("Error opening log file:", err)
		os.Exit(1)
	}
	defer logFile.Close()

	log := func(message string) {
		// Write log message to both file and console
		fmt.Println(message)
		logFile.WriteString(message + "\n")
	}

	log("Starting the application at " + time.Now().Format(time.RFC3339))

	var prismaDir string
	if *prismaDirFlagPtr != "" {
		prismaDir = *prismaDirFlagPtr
	} else {
		prismaDir = filepath.Join(homeDir, "AppData", "Roaming", "MD-Web-Extended", "EUR", "server", "prisma")
	}

	if _, err := os.Stat(prismaDir); os.IsNotExist(err) {
		err := os.Mkdir(prismaDir, 0755)
		if err != nil {
			log("Error creating directory: " + err.Error())
			os.Exit(1)
		} else {
			log("Directory created successfully.")
		}
	}

	log("Installing prisma at " + time.Now().Format(time.RFC3339))
	var cmd *exec.Cmd
	cmd = exec.Command("C:\\Program Files\\nodejs\\npm", "install", "prisma", "-g")
	cmd.Stdout = logFile
	cmd.Stderr = logFile
	err = cmd.Run()
	if err != nil {
		log("Error insatlling prisma: " + err.Error())
		os.Exit(1)
	}

	err = stopService(serviceName)
	if err != nil {
		log("Error stopping service: " + err.Error())
		os.Exit(1)
	}
	log("Stopping service at " + time.Now().Format(time.RFC3339))

	if *prismaPushFlagPtr {
		var cmd *exec.Cmd
		if *generateFlagPtr {
			cmd = exec.Command("C:\\Program Files\\nodejs\\npx", "prisma", "db", "push", "--accept-data-loss", "--skip-generate")
		} else {
			cmd = exec.Command("C:\\Program Files\\nodejs\\npx", "prisma", "db", "push", "--accept-data-loss")
		}

		cmd.Dir = prismaDir
		cmd.Stdout = logFile
		cmd.Stderr = logFile
		err := cmd.Run()
		if err != nil {
			log("Error executing command: " + err.Error())
			startService(serviceName)
			os.Exit(1)
		}
	}

	if *prismaMigrateFlagPtr {
		var cmd *exec.Cmd
		if *generateFlagPtr {
			cmd = exec.Command("npx", "prisma", "migrate", "dev", "-n", "migration", "--skip-generate")
		} else {
			cmd = exec.Command("npx", "prisma", "migrate", "dev", "-n", "migration")
		}

		cmd.Dir = prismaDir
		cmd.Stdout = logFile
		cmd.Stderr = logFile
		err := cmd.Run()
		if err != nil {
			log("Error executing command: " + err.Error())
			startService(serviceName)
			// try reset and then migrate
			os.Exit(2)
		}
	}

	err = startService(serviceName)
	if err != nil {
		log("Error starting service: " + err.Error())
		os.Exit(1)
	}
	log("Service started successfully")
}

func stopService(serviceName string) error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()

	service, err := m.OpenService(serviceName)
	if err != nil {
		return err
	}
	defer service.Close()

	status, err := service.Control(svc.Stop)
	if err != nil {
		return err
	}

	status, err = service.Query()
	for status.State != svc.Stopped {
		status, err = service.Query()
		if err != nil {
			return err
		}
	}
	// cwd, err := os.Getwd()
	// if err != nil {
	// 	return err
	// }

	// cmd := exec.Command("nssm.exe", "stop", serviceName)

	// cmd.Dir = cwd
	// err = cmd.Run()
	// if err != nil {
	// 	return err
	// }

	return nil
}

func startService(serviceName string) error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()

	service, err := m.OpenService(serviceName)
	if err != nil {
		return err
	}
	defer service.Close()

	err = service.Start()
	if err != nil {
		return err
	}

	// cwd, err := os.Getwd()
	// if err != nil {
	// 	return err
	// }

	// cmd := exec.Command("nssm.exe", "start", serviceName)

	// cmd.Dir = cwd
	// err = cmd.Run()
	// if err != nil {
	// 	return err
	// }

	return nil
}
