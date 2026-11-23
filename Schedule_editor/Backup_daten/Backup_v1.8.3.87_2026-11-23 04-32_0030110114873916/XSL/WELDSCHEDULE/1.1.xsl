<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="sched/@type" >
		<xsl:attribute name="head">
			<xsl:value-of select="."/>
		</xsl:attribute>
		<metadata>
			<schema_version/>
			<config_version>1.1.0</config_version>
			<author>Liburdi Automation</author>
			<date>02/08/2021</date>
			<signature/>
		</metadata>
		<description>
			<outer_diameter>
				<xsl:value-of select="/sched/desc/od"/>
			</outer_diameter>
			<xsl:choose>
				<xsl:when test="/sched/desc/groove_depth">
					<xsl:copy-of select="/sched/desc/groove_depth"/>
				</xsl:when>
				<xsl:otherwise>
					<groove_depth>0</groove_depth>
				</xsl:otherwise>
			</xsl:choose>
			<note />
		</description>
	</xsl:template>
	<xsl:template match="sched/head"/>
	<xsl:template match="sched/numsegs"/>
	<xsl:template match="sched/desc"/>

	<xsl:template match="sched/global/arctype" >
		<arc_type>
			<xsl:value-of select="."/>
		</arc_type>
		<excursion_mode>
			<xsl:value-of select="/sched/global/excursion_mode"/>
		</excursion_mode>
		<datalog_mode>1</datalog_mode>
	</xsl:template>
	<xsl:template match="sched/global/trailgas" >
		<trail_gas>
			<xsl:value-of select="."/>
		</trail_gas>
	</xsl:template>
	<xsl:template match="sched/global/backupgas">
		<backup_gas>
			<xsl:value-of select="."/>
		</backup_gas>
	</xsl:template>
	<xsl:template match="sched/global/plasmagas" >
		<plasma_gas>
			<xsl:value-of select="."/>
		</plasma_gas>
	</xsl:template>
	<xsl:template match="sched/global/pilotArcAuto" >
		<auto_disable_pilot_arc>
			<xsl:value-of select="."/>
		</auto_disable_pilot_arc>
		<pilot_arc_amps>10</pilot_arc_amps>
	</xsl:template>
	<xsl:template match="sched/global/initcur" >
		<initial_amps>
			<xsl:value-of select="."/>
		</initial_amps>
	</xsl:template>
	<xsl:template match="sched/global/fincur" >
		<final_amps>
			<xsl:value-of select="."/>
		</final_amps>
	</xsl:template>
	<xsl:template match="sched/global/impcur" >
		<impulse_amps>
			<xsl:value-of select="."/>
		</impulse_amps>
	</xsl:template>
	<xsl:template match="sched/global/imptime" >
		<impulse_time>
			<xsl:value-of select="."/>
		</impulse_time>
		<downslope>
			<xsl:value-of select="/sched/global/downslope"/>
		</downslope>
		<downslope_mode>
			<xsl:value-of select="/sched/global/downslopemode"/>
		</downslope_mode>
		<xsl:choose>
			<xsl:when test="/sched/global/thetadiameter">
				<theta_torch_height>
					<xsl:value-of select="format-number(/sched/global/thetadiameter div 2,'###,###,##0.00')"/>
				</theta_torch_height>
			</xsl:when>
			<xsl:otherwise>
				<theta_torch_height>6.5</theta_torch_height>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="sched/global/segadv"/>
	<xsl:template match="sched/global/downslope"/>
	<xsl:template match="sched/global/downslopemode"/>
	<xsl:template match="sched/global/thetadiameter"/>
	<xsl:template match="sched/global/travdir" >
		<travel_direction>
			<xsl:value-of select="."/>
		</travel_direction>
	</xsl:template>
	<xsl:template match="sched/global/dlogmode"/>
	<xsl:template match="sched/global/avcgap" >
		<ahc_gap>
			<xsl:value-of select="."/>
		</ahc_gap>
		<hotwire>
			<xsl:value-of select="/sched/global/hotwire"/>
		</hotwire>
		<hotwire2>
			<xsl:value-of select="/sched/global/hotwire2"/>
		</hotwire2>
		<hotwire_mode>
			<xsl:value-of select="/sched/global/hotwire_mode"/>
		</hotwire_mode>
		<ahc_retract>
			<xsl:value-of select="/sched/global/avcretract"/>
		</ahc_retract>
		<wire_retract>
			<xsl:value-of select="/sched/global/wireret"/>
		</wire_retract>
		<wire2_retract>
			<xsl:value-of select="/sched/global/wire2ret"/>
		</wire2_retract>
		<travel_delay>
			<xsl:value-of select="/sched/global/travdel"/>
		</travel_delay>
		<ahc_delay>
			<xsl:value-of select="/sched/global/avcdelay"/>
		</ahc_delay>
		<ahc_stop_delay>
			<xsl:value-of select="/sched/global/avcstop"/>
		</ahc_stop_delay>
		<wire_delay>
			<xsl:value-of select="/sched/global/wiredel"/>
		</wire_delay>
		<wire2_delay>
			<xsl:value-of select="/sched/global/wire2del"/>
		</wire2_delay>
		<travel_jog>
			<xsl:value-of select="/sched/global/travjog"/>
		</travel_jog>
		<wire_jog_fwd>
			<xsl:value-of select="/sched/global/wirejogfwd"/>
		</wire_jog_fwd>
		<wire_jog_rev>
			<xsl:value-of select="/sched/global/wirejogrev"/>
		</wire_jog_rev>
		<wire2_jog_fwd>
			<xsl:value-of select="/sched/global/wire2jogfwd"/>
		</wire2_jog_fwd>
		<wire2_jog_rev>
			<xsl:value-of select="/sched/global/wire2jogrev"/>
		</wire2_jog_rev>
		<ahc_jog>
			<xsl:value-of select="/sched/global/avcjog"/>
		</ahc_jog>
		<osc_jog>
			<xsl:value-of select="/sched/global/oscjog"/>
		</osc_jog>
		<theta_jog>
			<xsl:value-of select="/sched/global/thetajog"/>
		</theta_jog>
		<aux0_jog>
			<xsl:value-of select="/sched/global/aux0_jog"/>
		</aux0_jog>
		<aux1_jog>
			<xsl:value-of select="/sched/global/aux1_jog"/>
		</aux1_jog>
		<aux2_jog>
			<xsl:value-of select="/sched/global/aux2_jog"/>
		</aux2_jog>
		<aux3_jog>
			<xsl:value-of select="/sched/global/aux3_jog"/>
		</aux3_jog>
		<aux4_jog>
			<xsl:value-of select="/sched/global/aux4_jog"/>
		</aux4_jog>
		<aux5_jog>
			<xsl:value-of select="/sched/global/aux5_jog"/>
		</aux5_jog>
		<aux6_jog>
			<xsl:value-of select="/sched/global/aux6_jog"/>
		</aux6_jog>
		<aux7_jog>
			<xsl:value-of select="/sched/global/aux7_jog"/>
		</aux7_jog>
		<aux8_jog>
			<xsl:value-of select="/sched/global/aux8_jog"/>
		</aux8_jog>
		<aux9_jog>
			<xsl:value-of select="/sched/global/aux9_jog"/>
		</aux9_jog>
		<travel_step>
			<xsl:value-of select="/sched/global/travstep"/>
		</travel_step>
		<wire_step>
			<xsl:value-of select="/sched/global/wirestep"/>
		</wire_step>
		<wire2_step>
			<xsl:value-of select="/sched/global/wire2step"/>
		</wire2_step>
		<ahc_step>
			<xsl:value-of select="/sched/global/avcstep"/>
		</ahc_step>
		<theta_step>
			<xsl:value-of select="/sched/global/thetastep"/>
		</theta_step>
		<osc_step>
			<xsl:value-of select="/sched/global/oscstep"/>
		</osc_step>
		<aux0_step>0.000000</aux0_step>
		<aux1_step>0.000000</aux1_step>
		<aux2_step>0.000000</aux2_step>
		<aux3_step>0.000000</aux3_step>
		<aux4_step>0.000000</aux4_step>
		<aux5_step>0.000000</aux5_step>
		<aux6_step>0.000000</aux6_step>
		<aux7_step>0.000000</aux7_step>
		<aux8_step>0.000000</aux8_step>
		<aux9_step>0.000000</aux9_step>
		<osc_auto_center>0</osc_auto_center>
		<osc_auto_postposition>
			<xsl:value-of select="/sched/global/oscautopos"/>
		</osc_auto_postposition>
		<theta_auto_postposition>0.000000</theta_auto_postposition>
		<travel_auto_postposition>
			<xsl:value-of select="/sched/global/travautopos"/>
		</travel_auto_postposition>

		<xsl:choose>
			<xsl:when test="/sched/global/travelautopreposition">
				<travel_auto_preposition>
					<xsl:value-of select="/sched/global/travelautopreposition"/>
				</travel_auto_preposition>
			</xsl:when>
			<xsl:otherwise>
				<travel_auto_preposition>0.0</travel_auto_preposition>
			</xsl:otherwise>
		</xsl:choose>

		<travel_auto_zero>
			<xsl:value-of select="/sched/global/travautozero"/>
		</travel_auto_zero>

		<xsl:choose>
			<xsl:when test="/sched/global/travel_home_enable">
				<travel_auto_home>
					<xsl:value-of select="/sched/global/travel_home_enable"/>
				</travel_auto_home>
			</xsl:when>
			<xsl:otherwise>
				<travel_auto_home>0</travel_auto_home>
			</xsl:otherwise>
		</xsl:choose>

		<cut_angle>
			<xsl:value-of select="/sched/global/cut_angle"/>
		</cut_angle>
		<electrode_diameter>
			<xsl:value-of select="/sched/global/electrode_diameter"/>
		</electrode_diameter>
		<burn_back_time>
			<xsl:value-of select="format-number(/sched/global/burn_back_time div 1000,'###,###,##0.000')"/>
		</burn_back_time>
		<seamtrack_x_tracking_on>
			<xsl:value-of select="/sched/global/seamtrack_x_tracking_on"/>
		</seamtrack_x_tracking_on>
		<seamtrack_z_tracking_on>
			<xsl:value-of select="/sched/global/seamtrack_z_tracking_on"/>
		</seamtrack_z_tracking_on>
		<seamtrack_width_tracking_on>
			<xsl:value-of select="/sched/global/seamtrack_width_tracking_on"/>
		</seamtrack_width_tracking_on>
		<seamtrack_x_channel>
			<xsl:value-of select="/sched/global/seamtrack_x_channel"/>
		</seamtrack_x_channel>
		<seamtrack_z_channel>
			<xsl:value-of select="/sched/global/seamtrack_z_channel"/>
		</seamtrack_z_channel>
		<seamtrack_width_channel>
			<xsl:value-of select="/sched/global/seamtrack_width_channel"/>
		</seamtrack_width_channel>
		<seamtrack_program>
			<xsl:value-of select="/sched/global/seamtrack_program"/>
		</seamtrack_program>
		<seamtrack_angle>
			<xsl:value-of select="/sched/global/seamtrack_angle"/>
		</seamtrack_angle>
		<groovetrack_max_correction_edit_mode>
			<xsl:value-of select="/sched/global/groovetrackmaxcorr_mode"/>
		</groovetrack_max_correction_edit_mode>
		<groovetrack_sensitivity_edit_mode>
			<xsl:value-of select="/sched/global/groovetracksense_mode"/>
		</groovetrack_sensitivity_edit_mode>
		<groovetrack_axis>0</groovetrack_axis>
		<loop_count>0</loop_count>
		<loop_to>0</loop_to>
		<crater_fill_time>0</crater_fill_time>
		<avc_sensitivity>
			<xsl:value-of select="/sched/global/avcsens"/>
		</avc_sensitivity>
		<avc_high_sensitivity>
			<xsl:value-of select="/sched/global/avchisens"/>
		</avc_high_sensitivity>
		<avc_deadband>
			<xsl:value-of select="/sched/global/avcdeadband"/>
		</avc_deadband>
		<avc_slowband>
			<xsl:value-of select="/sched/global/avcslowband"/>
		</avc_slowband>
		<mig_closed_loop_delay>0.0</mig_closed_loop_delay>
	</xsl:template>
	<xsl:template match="sched/global/excursion_mode"/>
	<xsl:template match="sched/global/hotwire"/>
	<xsl:template match="sched/global/hotwire2"/>
	<xsl:template match="sched/global/hotwire_mode"/>
	<xsl:template match="sched/global/avcretract"/>
	<xsl:template match="sched/global/wireret"/>
	<xsl:template match="sched/global/wire2ret"/>
	<xsl:template match="sched/global/travdel"/>
	<xsl:template match="sched/global/avcdelay"/>
	<xsl:template match="sched/global/avcstop"/>
	<xsl:template match="sched/global/wiredel"/>
	<xsl:template match="sched/global/wire2del"/>
	<xsl:template match="sched/global/travjog"/>
	<xsl:template match="sched/global/wirejogfwd"/>
	<xsl:template match="sched/global/wirejogrev"/>
	<xsl:template match="sched/global/wire2jogfwd"/>
	<xsl:template match="sched/global/wire2jogrev"/>
	<xsl:template match="sched/global/avcjog"/>
	<xsl:template match="sched/global/oscjog"/>
	<xsl:template match="sched/global/travstep"/>
	<xsl:template match="sched/global/wirestep"/>
	<xsl:template match="sched/global/wire2step"/>
	<xsl:template match="sched/global/avcstep"/>
	<xsl:template match="sched/global/oscstep"/>
	<xsl:template match="sched/global/oscautopos"/>
	<xsl:template match="sched/global/travautopos"/>
	<xsl:template match="sched/global/travautozero"/>
	<xsl:template match="sched/global/cut_angle"/>
	<xsl:template match="sched/global/use_motion_pulse"/>
	<xsl:template match="sched/global/electrode_diameter"/>
	<xsl:template match="sched/global/burn_back_time"/>
	<xsl:template match="sched/global/seamtrack_x_tracking_on"/>
	<xsl:template match="sched/global/seamtrack_z_tracking_on"/>
	<xsl:template match="sched/global/seamtrack_width_tracking_on"/>
	<xsl:template match="sched/global/seamtrack_x_channel"/>
	<xsl:template match="sched/global/seamtrack_z_channel"/>
	<xsl:template match="sched/global/seamtrack_width_channel"/>
	<xsl:template match="sched/global/seamtrack_program"/>
	<xsl:template match="sched/global/seamtrack_angle"/>
	<xsl:template match="sched/global/groovetrackmaxcorr_mode"/>
	<xsl:template match="sched/global/groovetracksense_mode"/>
	<xsl:template match="sched/global/avcsens"/>
	<xsl:template match="sched/global/avchisens"/>
	<xsl:template match="sched/global/avcdeadband"/>
	<xsl:template match="sched/global/avcslowband"/>
	<xsl:template match="sched/global/travel_home_enable"/>
	<xsl:template match="sched/global/thetajog"/>
	<xsl:template match="sched/global/thetastep"/>
	<xsl:template match="travelautopreposition"/>
	<xsl:template match="oscsync"/>
	<xsl:template match="oscautocenter"/>
	<xsl:template match="xjog"/>
	<xsl:template match="xstep"/>
	<xsl:template match="yjog"/>
	<xsl:template match="ystep"/>
	<xsl:template match="aux0_jog"/>
	<xsl:template match="aux1_jog"/>
	<xsl:template match="aux2_jog"/>
	<xsl:template match="aux3_jog"/>
	<xsl:template match="aux4_jog"/>
	<xsl:template match="aux5_jog"/>
	<xsl:template match="aux6_jog"/>
	<xsl:template match="aux7_jog"/>
	<xsl:template match="aux8_jog"/>
	<xsl:template match="aux9_jog"/>

	<xsl:template match="sched/limits" >
		<limits>
			<pri_amp_error>
				<xsl:value-of select="/sched/limits/priamperr"/>
			</pri_amp_error>
			<pri_amp_fault>
				<xsl:value-of select="/sched/limits/priampflt"/>
			</pri_amp_fault>
			<bkg_amp_error>
				<xsl:value-of select="/sched/limits/bkgamperr"/>
			</bkg_amp_error>
			<bkg_amp_fault>
				<xsl:value-of select="/sched/limits/bkgampflt"/>
			</bkg_amp_fault>
			<wire_error>10</wire_error>
			<wire_fault>10</wire_fault>
			<wire2_error>10</wire2_error>
			<wire2_fault>10</wire2_fault>
			<travel_error>
				<xsl:value-of select="/sched/limits/traverr"/>
			</travel_error>
			<travel_fault>
				<xsl:value-of select="/sched/limits/travflt"/>
			</travel_fault>
			<voltage_low>
				<xsl:value-of select="/sched/limits/voltlow"/>
			</voltage_low>
			<voltage_high>
				<xsl:value-of select="/sched/limits/volthigh"/>
			</voltage_high>
			<fault_count_threshold>20</fault_count_threshold>
		</limits>
	</xsl:template>
	<xsl:template match="sched/limits/priamperr"/>
	<xsl:template match="sched/limits/priampflt"/>
	<xsl:template match="sched/limits/bkgamperr"/>
	<xsl:template match="sched/limits/bkgampflt"/>
	<xsl:template match="sched/limits/traverr"/>
	<xsl:template match="sched/limits/travflt"/>
	<xsl:template match="sched/limits/voltlow"/>
	<xsl:template match="sched/limits/volthigh"/>

	<xsl:template match="sched/overrides" >
		<overrides>
			<amp_max>
				<xsl:value-of select="/sched/overrides/ampMax"/>
			</amp_max>
			<amp_rate>
				<xsl:value-of select="/sched/overrides/ampRate"/>
			</amp_rate>
			<travel_max>
				<xsl:value-of select="/sched/overrides/travelMax"/>
			</travel_max>
			<travel_rate>
				<xsl:value-of select="/sched/overrides/travelRate"/>
			</travel_rate>
			<wire_max>
				<xsl:value-of select="/sched/overrides/wireMax"/>
			</wire_max>
			<wire_rate>
				<xsl:value-of select="/sched/overrides/wireRate"/>
			</wire_rate>
			<wire_retract_distance_max>
				<xsl:value-of select="/sched/overrides/wireRetractDistMax"/>
			</wire_retract_distance_max>
			<wire_retract_distance_rate>
				<xsl:value-of select="/sched/overrides/wireRetractDistRate"/>
			</wire_retract_distance_rate>
			<avg_wire_speed_max>
				<xsl:value-of select="/sched/overrides/avgWireSpeedMax"/>
			</avg_wire_speed_max>
			<avg_wire_speed_rate>
				<xsl:value-of select="/sched/overrides/avgWireSpeedRate"/>
			</avg_wire_speed_rate>
			<wire2_max>
				<xsl:value-of select="/sched/overrides/wire2Max"/>
			</wire2_max>
			<wire2_rate>
				<xsl:value-of select="/sched/overrides/wire2Rate"/>
			</wire2_rate>
			<wire2_retract_distance_max>
				<xsl:value-of select="/sched/overrides/wire2RetractDistMax"/>
			</wire2_retract_distance_max>
			<wire2_retract_distance_rate>
				<xsl:value-of select="/sched/overrides/wire2RetractDistRate"/>
			</wire2_retract_distance_rate>
			<avg_wire2_speed_max>
				<xsl:value-of select="/sched/overrides/avgWire2SpeedMax"/>
			</avg_wire2_speed_max>
			<avg_wire2_speed_rate>
				<xsl:value-of select="/sched/overrides/avgWire2SpeedRate"/>
			</avg_wire2_speed_rate>
			<hotwire_amps_max>
				<xsl:value-of select="/sched/overrides/hotwire1AmpsMax"/>
			</hotwire_amps_max>
			<hotwire_amps_rate>
				<xsl:value-of select="/sched/overrides/hotwire1AmpsRate"/>
			</hotwire_amps_rate>
			<hotwire2_amps_max>
				<xsl:value-of select="/sched/overrides/hotwire2AmpsMax"/>
			</hotwire2_amps_max>
			<hotwire2_amps_rate>
				<xsl:value-of select="/sched/overrides/hotwire2AmpsRate"/>
			</hotwire2_amps_rate>
			<volt_max>
				<xsl:value-of select="/sched/overrides/voltMax"/>
			</volt_max>
			<volt_rate>
				<xsl:value-of select="/sched/overrides/voltRate"/>
			</volt_rate>
			<theta_width_max>90</theta_width_max>
			<theta_width_rate>0.02</theta_width_rate>
			<osc_width_max>
				<xsl:value-of select="/sched/overrides/oscWidthMax"/>
			</osc_width_max>
			<osc_width_rate>
				<xsl:value-of select="/sched/overrides/oscWidthRate"/>
			</osc_width_rate>
			<dwell_max>
				<xsl:value-of select="/sched/overrides/dwellMax"/>
			</dwell_max>
			<dwell_rate>
				<xsl:value-of select="/sched/overrides/dwellRate"/>
			</dwell_rate>
			<excursion_max>
				<xsl:value-of select="/sched/overrides/excursionMax"/>
			</excursion_max>
			<excursion_rate>
				<xsl:value-of select="/sched/overrides/excursionRate"/>
			</excursion_rate>
			<xsl:copy-of select="/sched/overrides/prox_override_max"/>
			<xsl:copy-of select="/sched/overrides/prox_override_rate"/>
			<workpoint_override_max>10</workpoint_override_max>
			<workpoint_override_rate>0.1</workpoint_override_rate>
			<trim_override_max>
				<xsl:value-of select="/sched/overrides/mig_trim_override_max"/>
			</trim_override_max>
			<trim_override_rate>
				<xsl:value-of select="/sched/overrides/mig_trim_override_rate"/>
			</trim_override_rate>
			<wave_control_1_override_max>
				<xsl:value-of select="/sched/overrides/mig_ultimarc_override_max"/>
			</wave_control_1_override_max>
			<wave_control_1_override_rate>
				<xsl:value-of select="/sched/overrides/mig_ultimarc_override_rate"/>
			</wave_control_1_override_rate>
			<wave_control_2_override_max>10</wave_control_2_override_max>
			<wave_control_2_override_rate>0.1</wave_control_2_override_rate>
			<wave_control_3_override_max>10</wave_control_3_override_max>
			<wave_control_3_override_rate>0.1</wave_control_3_override_rate>
			<wave_control_4_override_max>10</wave_control_4_override_max>
			<wave_control_4_override_rate>0.1</wave_control_4_override_rate>
			<mig_sensitivity_override_max>10</mig_sensitivity_override_max>
			<mig_sensitivity_override_rate>0.1</mig_sensitivity_override_rate>
			<mig_pulse_width_min_override_max>10</mig_pulse_width_min_override_max>
			<mig_pulse_width_min_override_rate>0.1</mig_pulse_width_min_override_rate>
			<mig_pulse_width_max_override_max>10</mig_pulse_width_max_override_max>
			<mig_pulse_width_max_override_rate>0.1</mig_pulse_width_max_override_rate>
			<blast_time_override_max>10</blast_time_override_max>
			<blast_time_override_rate>0.1</blast_time_override_rate>
			<blast_amps_override_max>10</blast_amps_override_max>
			<blast_amps_override_rate>0.1</blast_amps_override_rate>
			<pulse_freq_override_max>10</pulse_freq_override_max>
			<pulse_freq_override_rate>0.1</pulse_freq_override_rate>
			<pulse_width_override_max>10</pulse_width_override_max>
			<pulse_width_override_rate>0.1</pulse_width_override_rate>
			<motion_pulse_width_override_max>10</motion_pulse_width_override_max>
			<motion_pulse_width_override_rate>0.1</motion_pulse_width_override_rate>
			<motion_pulse_freq_override_max>10</motion_pulse_freq_override_max>
			<motion_pulse_freq_override_rate>0.1</motion_pulse_freq_override_rate>
			<compound_steering_angle_offset_max>10</compound_steering_angle_offset_max>
			<compound_steering_angle_offset_rate>1</compound_steering_angle_offset_rate>
			<xsl:choose>
				<xsl:when test="/sched/overrides/wire_manipulator_in_out_width_max">
					<wire_manipulator_in_out_width_max>
						<xsl:value-of select="/sched/overrides/wire_manipulator_in_out_width_max"/>
					</wire_manipulator_in_out_width_max>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/sched/overrides/wire_manipulator_in_out_width_rate">
					<wire_manipulator_in_out_width_rate>
						<xsl:value-of select="/sched/overrides/wire_manipulator_in_out_width_rate"/>
					</wire_manipulator_in_out_width_rate>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/sched/overrides/tungsten_width_max">
					<tungsten_width_max>
						<xsl:value-of select="/sched/overrides/tungsten_width_max"/>
					</tungsten_width_max>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/sched/overrides/tungsten_width_rate">
					<tungsten_width_rate>
						<xsl:value-of select="/sched/overrides/tungsten_width_rate"/>
					</tungsten_width_rate>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
		</overrides>
	</xsl:template>

	<xsl:template match="sched/overrides/ampMax"/>
	<xsl:template match="sched/overrides/ampRate"/>
	<xsl:template match="sched/overrides/travelMax"/>
	<xsl:template match="sched/overrides/travelRate"/>
	<xsl:template match="sched/overrides/wireMax"/>
	<xsl:template match="sched/overrides/wireRatev"/>
	<xsl:template match="sched/overrides/wireRetractDistMax"/>
	<xsl:template match="sched/overrides/wireRetractDistRatev"/>
	<xsl:template match="sched/overrides/avgWireSpeedMax "/>
	<xsl:template match="sched/overrides/avgWireSpeedRate"/>
	<xsl:template match="sched/overrides/wire2Max"/>
	<xsl:template match="sched/overrides/wire2Rate"/>
	<xsl:template match="sched/overrides/wire2RetractDistMax"/>
	<xsl:template match="sched/overrides/wire2RetractDistRate"/>
	<xsl:template match="sched/overrides/avgWire2SpeedMax"/>
	<xsl:template match="sched/overrides/avgWire2SpeedRate"/>
	<xsl:template match="sched/overrides/hotwire1AmpsMax"/>
	<xsl:template match="sched/overrides/hotwire1AmpsRate"/>
	<xsl:template match="sched/overrides/hotwire2AmpsMax"/>
	<xsl:template match="sched/overrides/hotwire2AmpsRate"/>
	<xsl:template match="sched/overrides/voltMax"/>
	<xsl:template match="sched/overrides/voltRate"/>
	<xsl:template match="sched/overrides/oscWidthMax"/>
	<xsl:template match="sched/overrides/oscWidthRate"/>
	<xsl:template match="sched/overrides/dwellMax"/>
	<xsl:template match="sched/overrides/dwellRate"/>
	<xsl:template match="sched/overrides/excursionMax"/>
	<xsl:template match="sched/overrides/excursionRate"/>
	<xsl:template match="sched/overrides/mig_trim_override_max"/>
	<xsl:template match="sched/overrides/mig_trim_override_rate"/>
	<xsl:template match="sched/overrides/mig_pinch_override_max"/>
	<xsl:template match="sched/overrides/mig_ultimarc_override_max"/>
	<xsl:template match="sched/overrides/mig_pinch_override_rate"/>
	<xsl:template match="sched/overrides/mig_ultimarc_override_rate"/>

	<xsl:variable name="arcType" select="sched/global/arctype"/>

	<xsl:template match="sched/seg" >
		<segment>
			<xsl:attribute name="index">
				<xsl:value-of select="@index"/>
			</xsl:attribute>
			<enable>
				<xsl:value-of select="./enable"/>
			</enable>
			<mode>
				<xsl:value-of select="./mode"/>
			</mode>
			<segment_time>
				<xsl:value-of select="./segtime"/>
			</segment_time>
			<slope>
				<xsl:value-of select="./slope"/>
			</slope>
			<travel_angle>0</travel_angle>
			<xsl:choose>
				<xsl:when test="./sync_mode">
					<sync_mode>
						<xsl:value-of select="./sync_mode"/>
					</sync_mode>
				</xsl:when>
				<xsl:otherwise>
					<sync_mode>1</sync_mode>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="$arcType = 'MIG'">
					<pri_ahc>
						<xsl:value-of select="./prox"/>
					</pri_ahc>
					<bkg_ahc>
						<xsl:value-of select="./prox"/>
					</bkg_ahc>
				</xsl:when>
				<xsl:otherwise>
					<pri_ahc>
						<xsl:value-of select="./privolt"/>
					</pri_ahc>
					<bkg_ahc>
						<xsl:value-of select="./bkgvolt"/>
					</bkg_ahc>
				</xsl:otherwise>
			</xsl:choose>
			<volts>10</volts>
			<pri_amp>
				<xsl:value-of select="./priamp"/>
			</pri_amp>
			<bkg_amp>
				<xsl:value-of select="./bkgamp"/>
			</bkg_amp>
			<xsl:choose>
				<xsl:when test="./pulsefreq='0'">
					<pulse_freq>2</pulse_freq>
				</xsl:when>
				<xsl:otherwise>
					<pulse_freq>
						<xsl:value-of select="./pulsefreq"/>
					</pulse_freq>
				</xsl:otherwise>
			</xsl:choose>
			<pulse_width>
				<xsl:value-of select="./pulsewidth"/>
			</pulse_width>
			<motion_pulse_freq>
				<xsl:value-of select="./motionpulsefreq"/>
			</motion_pulse_freq>
			<motion_pulse_width>
				<xsl:value-of select="./motionpulsewidth"/>
			</motion_pulse_width>
			<pri_travel>
				<xsl:value-of select="./pritrav"/>
			</pri_travel>
			<bkg_travel>
				<xsl:value-of select="./bkgtrav"/>
			</bkg_travel>
			<pri_wire>
				<xsl:value-of select="./priwire"/>
			</pri_wire>
			<bkg_wire>
				<xsl:value-of select="./bkgwire"/>
			</bkg_wire>
			<pri_wire2>
				<xsl:value-of select="./priwire2"/>
			</pri_wire2>
			<bkg_wire2>
				<xsl:value-of select="./bkgwire2"/>
			</bkg_wire2>
			<avc_mode>
				<xsl:value-of select="./avcmode"/>
			</avc_mode>
			<theta_width>0</theta_width>
			<osc_width>
				<xsl:value-of select="./oscwidth"/>
			</osc_width>
			<indwell>
				<xsl:value-of select="./indwell"/>
			</indwell>
			<outdwell>
				<xsl:value-of select="./outdwell"/>
			</outdwell>
			<excursion>
				<xsl:value-of select="./excursion"/>
			</excursion>
			<hotwire_amps>
				<xsl:value-of select="./hotwireamps"/>
			</hotwire_amps>
			<hotwire2_amps>
				<xsl:value-of select="./hotwire2amps"/>
			</hotwire2_amps>
			<mig_mode>
				<xsl:value-of select="./al_mode"/>
			</mig_mode>
			<workpoint>
				<xsl:value-of select="./al_wp"/>
			</workpoint>
			<trim>
				<xsl:value-of select="./al_trim"/>
			</trim>
			<wave_control1>
				<xsl:value-of select="./al_wc1"/>
			</wave_control1>
			<wave_control2>
				<xsl:value-of select="./al_wc2"/>
			</wave_control2>
			<wave_control3>
				<xsl:value-of select="./al_wc3"/>
			</wave_control3>
			<wave_control4>
				<xsl:value-of select="./al_wc4"/>
			</wave_control4>
			<groovetrack_mode>
				<xsl:value-of select="./groovetracking_mode"/>
			</groovetrack_mode>
			<groovetrack_sensitivity>
				<xsl:value-of select="./groovetracking_sense"/>
			</groovetrack_sensitivity>
			<groovetrack_smoothing>0</groovetrack_smoothing>
			<groovetrack_max_correction>
				<xsl:value-of select="./groovetracking_maxcorrection"/>
			</groovetrack_max_correction>
			<groovetrack_bias>
				<xsl:value-of select="./groovetracking_bias"/>
			</groovetrack_bias>
			<mig_pulse_width_min>5</mig_pulse_width_min>
			<mig_pulse_width_max>30</mig_pulse_width_max>
			<blast_time>0</blast_time>
			<blast_amps>90</blast_amps>
			<compound_steering_angle_offset>0</compound_steering_angle_offset>
			<xsl:choose>
				<xsl:when test="./wire_manipulator_in_out_width">
					<wire_manipulator_in_out_width>
						<xsl:value-of select="./wire_manipulator_in_out_width"/>
					</wire_manipulator_in_out_width>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="./tungsten_width">
					<tungsten_width>
						<xsl:value-of select="./tungsten_width"/>
					</tungsten_width>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
		</segment>
	</xsl:template>

	<xsl:template match="sched/search"/>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>