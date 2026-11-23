<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- FILE TYPE: AXI -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='AXI']/str[@id='15']/text">
		<xsl:copy>
			<xsl:value-of select="'The system is detecting a closed circuit voltage at the electrode. The electrode may be touching the work piece. Jog the torch up and away from the part to break contact.'"/>
		</xsl:copy>
	</xsl:template>

	<!-- FILE TYPE: EXE -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='EXE']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="16">
				<text>There are no segments enabled in the schedule. Enable at least one segment before starting again.</text>
				<desc></desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- FILE TYPE: SCH -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='SCH']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="40">
				<text>Segment number %1 has Groove Tracking Play Back mode enabled before any previous segments used Real Time mode.</text>
				<desc>%1 = segment index</desc>
			</str>
			<str id="41">
				<text>Segment number %1 has Groove Tracking enabled and a zero value for the sensitivity.</text>
				<desc>%1 = segment index</desc>
			</str>
			<str id="42">
				<text>Segment number %1 has Groove Tracking enabled and a zero value for the max correction.</text>
				<desc>%1 = segment index</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- FILE TYPE: SYS -->
	<xsl:template match="/language[@localeID='en-CA' and @fileType='SYS']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="34">
				<text>USB storage device not connected. Please connect a USB storage device to the system and try again.</text>
				<desc></desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="language[@localeID='en-CA' and @fileType='DEV']/str[@id='28']">
		<str id="28">
			<text>Gas flow rate of 0 is not advisable.</text>
			<desc>Gas flow will be enabled with a flow rate of 0 which is not recommended.</desc>
		</str>
	</xsl:template>

	<xsl:template match="language[@localeID='en-CA' and @fileType='POW']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="20">
				<text>Ensure that the orifice connector is connected at the back of the power supply. Failure to do so could result in a serious shock. Press %1 to enable the pilot arc.</text>
				<desc>Warning when enabling the pilot arc. %1 = name of button to enable the pilot arc.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="language[@localeID='en-CA' and @fileType='TTL']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="33">
				<text>DANGER HIGH VOLTAGE PRESENT AT TORCH</text>
				<desc>Title for high voltage warning</desc>
			</str>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>