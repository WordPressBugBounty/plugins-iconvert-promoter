<?php
namespace KPromo\Blocks;
use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\Utils as CoreUtils;

class CountdownBlock extends BlockBase {

	const OUTER     = 'outer';
	const CONTAINER = 'container';

	public function computed() {
		return array();
	}

	public function mapPropsToElements() {

		$cdDateTime          = $this->getAttribute( 'cdDateTime' );
		$labels              = $this->getAttribute( 'labels' );
		$separators          = $this->getAttribute( 'separator' );
		$datetimeendbehavior = $this->getAttribute( 'datetimeendbehavior' );

		$datetimetype = $this->getAttribute( 'datetimetype' );

		$evergreenHours   = '';
		$evergreenMinutes = '';
		$isEverGreenType  = $datetimetype === 'evergreen';
		if ( $isEverGreenType ) {
			$evergreenHours   = $this->getAttribute( 'evergreenHours' );
			$evergreenMinutes = $this->getAttribute( 'evergreenMinutes' );
		}

		$cookieId        = $this->getAttribute( 'cookieId' );
		$activateDays    = $this->getAttribute( 'activateDays' );
		$activateHours   = $this->getAttribute( 'activateHours' );
		$activateMinutes = $this->getAttribute( 'activateMinutes' );
		$activateSeconds = $this->getAttribute( 'activateSeconds' );

		$timezone = $this->getAttribute( 'utcZone' );

		$classShowLabels     = $labels['show'] === true ? '' : 'countdown-hide-all-labels';
		$classShowSeparators = $separators['show'] === true ? '' : 'countdown-hide-separator';

		$jsCounterProps = array(
			'cdDateTime'          => $cdDateTime,
			'timezone'            => $timezone,
			'datetimetype'        => $datetimetype,
			'datetimeendbehavior' => $datetimeendbehavior,
			'evergreenHours'      => $evergreenHours,
			'evergreenMinutes'    => $evergreenMinutes,
			'cookieId'            => $cookieId,
		);

		$outer_classes = array( $classShowLabels, $classShowSeparators, 'wp-block-cspromo-countdown--not-loaded' );
		if ( $activateDays && ! $isEverGreenType ) {
			$outer_classes[] = 'wp-block-cspromo-countdown__days-item--show';
		}
		if ( $activateHours ) {
			$outer_classes[] = 'wp-block-cspromo-countdown__hours-item--show';
		}
		if ( $activateMinutes ) {
			$outer_classes[] = 'wp-block-cspromo-countdown__minutes-item--show';
		}
		if ( $activateSeconds ) {
			$outer_classes[] = 'wp-block-cspromo-countdown__seconds-item--show';
		}
		$jsCounterProps = CoreUtils::useJSComponentProps( 'countdown', $jsCounterProps );
		return array(
			self::OUTER     => array_merge(
				array(
					'className' => $outer_classes,
				),
				$jsCounterProps
			),
			self::CONTAINER => array(),
		);
	}
}


Registry::registerBlock(
	__DIR__,
	CountdownBlock::class
);
