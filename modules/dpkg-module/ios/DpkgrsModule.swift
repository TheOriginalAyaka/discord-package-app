import ExpoModulesCore

public class DpkgrsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("Dpkgrs")

        Events("onProgress", "onError", "onComplete", "onAnalyticsComplete")

        Function("startExtraction") {
            (path: String, processAnalytics: Bool) -> String? in
            let observer = ExObserver(emitter: self)
            return startExtraction(
                path: path,
                processAnalytics: processAnalytics,
                observer: observer
            )
        }

        Function("cancelExtraction") { (id: String) -> Bool in
            return cancelExtraction(extractionId: id)
        }
    }
}

final class ExObserver: ExtractObserver {
    weak var emitter: DpkgrsModule?

    init(emitter: DpkgrsModule) {
        self.emitter = emitter
    }

    func onProgress(progress: OnProgress) {
        emitter?.sendEvent("onProgress", ["progress": progress.toDictionary()])
    }

    func onError(error: OnError) {
        emitter?.sendEvent("onError", ["error": error.toDictionary()])
    }

    func onComplete(result: UserData) {
        emitter?.sendEvent("onComplete", ["result": result.toDictionary()])
    }

    func onAnalyticsComplete(result: EventCount) {
        emitter?.sendEvent(
            "onAnalyticsComplete",
            ["result": result.toDictionary()]
        )
    }
}

extension OnError: DictionaryConvertible {}

extension OnProgress: DictionaryConvertible {}

extension EventCount: DictionaryConvertible {}

extension UserData: DictionaryConvertible {}

protocol DictionaryConvertible {
    func toDictionary() -> [String: Any]
}

extension DictionaryConvertible {
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
