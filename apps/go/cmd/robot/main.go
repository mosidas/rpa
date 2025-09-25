// Package robot: robotgoのラッパー
package robot

import (
	"strings"
	"time"

	"github.com/go-vgo/robotgo"
)

// GetCurrentLocation  現在のカーソルの位置を取得する。
func GetCurrentLocation() (int, int) {
	return robotgo.Location()
}

func GetClipboard() (string, error) {
	return robotgo.ReadAll()
}

func SetClipboard(s string) error {
	return robotgo.WriteAll(s)
}

func ExecuteCommandWith(key string, args ...interface{}) {
	keys := append(args, robotgo.Lcmd)
	robotgo.KeyTap(key, keys)
	robotgo.KeyToggle(robotgo.Cmd, robotgo.Up)
}

func GetScreenShot(args ...interface{}) error {
	winName := ""
	fName := time.Now().Format("2006-01-02-15-04-05") + ".png"
	if len(args) == 0 {
		return robotgo.SaveCapture("./" + fName + ".png")
	}

	if len(args) > 1 {
		if f, ok := args[1].(string); ok {
			fName = f
		}
	}

	if w, ok := args[0].(string); ok {
		winName = w
	}

	process, err := robotgo.Process()
	if err != nil {
		return err
	}

	for _, p := range process {
		if strings.Contains(strings.ToLower(p.Name), winName) {
			x, y, w, h := robotgo.GetBounds(p.Pid)
			if x != 0 && y != 0 && w != 0 && h != 0 {
				robotgo.SaveCapture("./"+fName, x, y, w, h)
			} else {
				robotgo.SaveCapture("./" + fName)
			}

			return nil
		}
	}
	return nil
}

func DeleteInput() {
	ExecuteCommandWith(robotgo.KeyA)
	robotgo.KeyTap(robotgo.Backspace)
}

func GetInput() (string, error) {
	ExecuteCommandWith(robotgo.KeyA)
	ExecuteCommandWith(robotgo.KeyC)
	return GetClipboard()
}
