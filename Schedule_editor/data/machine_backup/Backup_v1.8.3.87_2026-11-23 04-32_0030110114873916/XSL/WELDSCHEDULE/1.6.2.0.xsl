<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/wire_manipulator_in_out_step">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/tungsten_jog">
				<tungsten_jog>
					<xsl:value-of select="/sched/global/tungsten_jog"/>
				</tungsten_jog>
			</xsl:when>
			<xsl:otherwise>
				<tungsten_jog>5</tungsten_jog>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/sched/global/tungsten_step">
				<tungsten_step>
					<xsl:value-of select="/sched/global/tungsten_step"/>
				</tungsten_step>
			</xsl:when>
			<xsl:otherwise>
				<tungsten_step>0</tungsten_step>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/sched/global/wire_manipulator_in_out_auto_preposition">
				<wire_manipulator_in_out_auto_preposition>
					<xsl:value-of select="/sched/global/wire_manipulator_in_out_auto_preposition"/>
				</wire_manipulator_in_out_auto_preposition>
			</xsl:when>
			<xsl:otherwise>
				<wire_manipulator_in_out_auto_preposition>0</wire_manipulator_in_out_auto_preposition>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/sched/global/wire_manipulator_in_out_auto_postposition">
				<wire_manipulator_in_out_auto_postposition>
					<xsl:value-of select="/sched/global/wire_manipulator_in_out_auto_postposition"/>
				</wire_manipulator_in_out_auto_postposition>
			</xsl:when>
			<xsl:otherwise>
				<wire_manipulator_in_out_auto_postposition>0</wire_manipulator_in_out_auto_postposition>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/sched/global/tungsten_auto_preposition">
				<tungsten_auto_preposition>
					<xsl:value-of select="/sched/global/tungsten_auto_preposition"/>
				</tungsten_auto_preposition>
			</xsl:when>
			<xsl:otherwise>
				<tungsten_auto_preposition>0</tungsten_auto_preposition>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/sched/global/tungsten_auto_postposition">
				<tungsten_auto_postposition>
					<xsl:value-of select="/sched/global/tungsten_auto_postposition"/>
				</tungsten_auto_postposition>
			</xsl:when>
			<xsl:otherwise>
				<tungsten_auto_postposition>0</tungsten_auto_postposition>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/sched/overrides/compound_steering_angle_offset_rate">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/overrides/wire_manipulator_in_out_width_max">
				<wire_manipulator_in_out_width_max>
					<xsl:value-of select="/sched/overrides/wire_manipulator_in_out_width_max"/>
				</wire_manipulator_in_out_width_max>
				<wire_manipulator_in_out_width_rate>
					<xsl:value-of select="/sched/overrides/wire_manipulator_in_out_width_rate"/>
				</wire_manipulator_in_out_width_rate>
				<tungsten_width_max>
					<xsl:value-of select="/sched/overrides/tungsten_width_max"/>
				</tungsten_width_max>
				<tungsten_width_rate>
					<xsl:value-of select="/sched/overrides/tungsten_width_rate"/>
				</tungsten_width_rate>
			</xsl:when>
			<xsl:otherwise>
				<wire_manipulator_in_out_width_max>10</wire_manipulator_in_out_width_max>
				<wire_manipulator_in_out_width_rate>0.02</wire_manipulator_in_out_width_rate>
				<tungsten_width_max>10</tungsten_width_max>
				<tungsten_width_rate>0.02</tungsten_width_rate>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/sched/segment/mig_pulse_d_gain">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/segment/wire_manipulator_in_out_width">
				<wire_manipulator_in_out_width>
					<xsl:value-of select="/sched/segment/wire_manipulator_in_out_width"/>
				</wire_manipulator_in_out_width>
				<tungsten_width>
					<xsl:value-of select="/sched/segment/tungsten_width"/>
				</tungsten_width>
			</xsl:when>
			<xsl:otherwise>
				<wire_manipulator_in_out_width>0.0</wire_manipulator_in_out_width>
				<tungsten_width>0.0</tungsten_width>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/sched/global/tungsten_jog"/>
	<xsl:template match="/sched/global/tungsten_step"/>
	<xsl:template match="/sched/global/wire_manipulator_in_out_auto_preposition"/>
	<xsl:template match="/sched/global/wire_manipulator_in_out_auto_postposition"/>
	<xsl:template match="/sched/global/tungsten_auto_preposition"/>
	<xsl:template match="/sched/global/tungsten_auto_postposition"/>
	<xsl:template match="/sched/overrides/wire_manipulator_in_out_width_max"/>
	<xsl:template match="/sched/overrides/wire_manipulator_in_out_width_rate"/>
	<xsl:template match="/sched/overrides/tungsten_width_max"/>
	<xsl:template match="/sched/overrides/tungsten_width_rate"/>
	<xsl:template match="/sched/segment/wire_manipulator_in_out_width"/>
	<xsl:template match="/sched/segment/tungsten_width"/>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>