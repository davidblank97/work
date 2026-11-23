<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/cal/amps/@timestamp" />
	<xsl:template match="/cal/amps/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>

	<xsl:template match="/cal/volts/@timestamp" />
	<xsl:template match="/cal/volts/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>

	<xsl:template match="/cal/hotwire/@timestamp" />
	<xsl:template match="/cal/hotwire/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>

	<xsl:template match="/cal/hotwire2/@timestamp" />
	<xsl:template match="/cal/hotwire2/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<xsl:template match="/cal/pilot/@timestamp" />
	<xsl:template match="/cal/pilot/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<xsl:template match="/cal/shield_gas/@timestamp" />
	<xsl:template match="/cal/shield_gas/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<xsl:template match="/cal/trail_gas/@timestamp" />
	<xsl:template match="/cal/trail_gas/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<xsl:template match="/cal/plasma_gas/@timestamp" />
	<xsl:template match="/cal/plasma_gas/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<xsl:template match="/cal/backup_gas/@timestamp" />
	<xsl:template match="/cal/backup_gas/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>