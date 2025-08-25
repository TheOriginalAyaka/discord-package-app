import ExpoModulesCore

public class DpkgrsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("Dpkgrs")
        
        Events("onProgress", "onError", "onComplete")
        
        Function("process") { (path: String) in
            let observer = ExObserver(emitter: self)
            startExtraction(path: path, observer: observer)
        }
    }
}

final class ExObserver: ExtractObserver {
    weak var emitter : DpkgrsModule?
    
    init(emitter: DpkgrsModule) {
        self.emitter = emitter
    }
    
    func onProgress(step: String) {
        emitter?.sendEvent("onProgress", ["step": step])
    }
    
    func onError(message: String) {
        emitter?.sendEvent("onError", ["message": message])
    }
    
    func onComplete(result: ExtractedData) {
        print("complete with result \(result)")
        emitter?.sendEvent("onComplete", ["result": result.toDictionary()])
    }
}

extension ExtractedData {
    func toDictionary() -> [String: Any] {
        return Self.convertToDict(self) as? [String: Any] ?? [:]
    }
    
    private static func convertToDict(_ object: Any) -> Any {
        let mirror = Mirror(reflecting: object)
        
        if mirror.displayStyle == .collection {
            return mirror.children.map { convertToDict($0.value) }
        }
        
        if mirror.displayStyle == .optional {
            if let value = mirror.children.first?.value {
                return convertToDict(value)
            } else {
                return NSNull()
            }
        }
        
        if !mirror.children.isEmpty {
            var dict: [String: Any] = [:]
            
            for child in mirror.children {
                if let key = child.label {
                    dict[key] = convertToDict(child.value)
                }
            }
            
            return dict
        }
        
        return object
    }
}
