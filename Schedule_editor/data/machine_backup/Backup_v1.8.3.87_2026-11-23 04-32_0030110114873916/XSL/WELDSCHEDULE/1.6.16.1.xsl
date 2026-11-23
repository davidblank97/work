<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<!-- Template to match item elements -->
	<xsl:template match="/sched/global/travel_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/sched/global/osc_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/sched/global/theta_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/sched/global/ahc_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/sched/global/wire_manipulator_in_out_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/sched/global/tungsten_auto_preposition">
		<xsl:choose>
			<xsl:when test="number(.) = 0">
				<xsl:copy>
					<xsl:value-of select="9999.0"/>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>