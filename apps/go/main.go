package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/go-vgo/robotgo"
)

// printLocation: 現在のポインターの位置を出力する。
func printLocation() {
	x, y := robotgo.Location()
	fmt.Printf("location: %v %v\n", x, y)
}

// printClipboard: 現在のクリップボードのテキストを出力する。
func printClipboard() {
	clipStr, err := robotgo.ReadAll() // クリップボードから値を読み込み
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("clipboard: %v\n", clipStr)
}

// deleteInput: 現在のフォーカスされているテキストボックスの内容を削除する。
func deleteInput() {
	commandWith(robotgo.KeyA)
	robotgo.KeyTap(robotgo.Backspace)
}

// copyInput: 現在のフォーカスされているテキストボックスの内容をクリップボードにコピーする。
func copyInput() {
	commandWith(robotgo.KeyA)
	commandWith(robotgo.KeyC)
	printClipboard()
}

// commandWith: command + {key} を実行する。
func commandWith(key string) {
	robotgo.KeyTap(key, robotgo.Lcmd)
	robotgo.KeyToggle(robotgo.Cmd, robotgo.Up)
}

func getScreenShot() {
	process, _ := robotgo.Process()

	for _, p := range process {
		// fmt.Printf("process name: %v", p.Name)
		if strings.Contains(strings.ToLower(p.Name), "dummy") {
			// ウィンドウの位置とサイズを取得
			x, y, w, h := robotgo.GetBounds(p.Pid)
			fmt.Printf("name:%v %v\n", p.Name, robotgo.IsValid())
			fmt.Printf("hwnd:%v x:%v y:%v w:%v h:%v\n", p.Pid, x, y, w, h)

			fileName := time.Now().Format("2006-01-02-15-04-05")
			if x != 0 && y != 0 && w != 0 && h != 0 {
				robotgo.SaveCapture("./"+fileName+".png", x, y, w, h)
			} else {
				robotgo.SaveCapture("./"+fileName+".png", 0, 25, 1500, 1612)
			}

			return
		}
	}
}

func handleScreenShot() {
	getScreenShot()
}

func handleDummygui() {
	robotgo.Click(robotgo.Right)
	commandWith(robotgo.Escape)
	commandWith(robotgo.Space)

	robotgo.Move(100, 100)
	robotgo.Click(robotgo.Left)
	printLocation()

	// form
	robotgo.MoveSmooth(800, 240, 0.5, 0.7)
	robotgo.Click(robotgo.Left)

	robotgo.MoveSmooth(260, 460, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	deleteInput()
	robotgo.TypeStr("hello worldあいうえお")
	robotgo.TypeStr(strings.Repeat("a", 100))
	copyInput()
	printLocation()

	robotgo.MoveSmooth(270, 510, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	deleteInput()
	robotgo.TypeStr("p@ssw0rd")
	copyInput()
	printLocation()

	robotgo.MoveSmooth(240, 565, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	deleteInput()
	robotgo.TypeStr("dummy@example.com")
	copyInput()
	printLocation()

	robotgo.MoveSmooth(600, 575, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	printLocation()

	// table
	robotgo.MoveSmooth(950, 240, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	printLocation()
	robotgo.MoveSmooth(350, 600, 0.5, 0.7)
	printLocation()
	robotgo.ScrollDir(200, "down")
	time.Sleep(5 * time.Millisecond)
	robotgo.ScrollDir(100, "right")
	time.Sleep(5 * time.Millisecond)

	// canvas
	robotgo.MoveSmooth(1230, 240, 0.5, 0.7)
	robotgo.Click(robotgo.Left)
	robotgo.MoveSmooth(250, 480, 0.5, 0.7)
	robotgo.DragSmooth(800, 500, 0.5, 0.7)

}

func main() {
	robotgo.MouseSleep = 100
	robotgo.KeySleep = 100
	robotgo.Sleep(1)
	fmt.Println("===start===")
	// handleDummygui()
	handleScreenShot()
	fmt.Println("===end===")
}
